import { fetchAssistantConfig, sendChatMessage, sendFeedback } from "./chat-api.js";
import { createChatPanel } from "./chat-panel.js";
import { createChatStore } from "./chat-store.js";

function derivePageContext() {
  return {
    currentPage: document.body.dataset.currentPage || "homepage",
    currentFeature: document.body.dataset.currentFeature || null,
    currentModel: document.body.dataset.currentModel || null,
    entryPoint: "floating-chat",
    uiLanguage: document.documentElement.lang || "en",
  };
}

function addAssistantMessage(store, message) {
  store.messages.push({
    id: crypto.randomUUID(),
    role: "assistant",
    feedbackState: null,
    ...message,
  });
}

function addUserMessage(store, text) {
  store.messages.push({
    id: crypto.randomUUID(),
    role: "user",
    text,
    citations: [],
  });
}

function updateFeedbackState(store, feedbackToken, feedbackState) {
  store.messages = store.messages.map((message) =>
    message.feedbackToken === feedbackToken ? { ...message, feedbackState } : message,
  );
}

export async function mountChatWidget() {
  const store = createChatStore();
  const panel = createChatPanel();
  document.body.append(panel.element);

  const config = await fetchAssistantConfig();
  store.config = config;
  panel.renderConfig(config);
  panel.setStatus("Responses are concise and citation-backed.");

  addAssistantMessage(store, {
    text: "Ask about Videoinu 2.0 features, workflows, export steps, models, or troubleshooting.",
    citations: [],
  });
  panel.renderMessages(store);

  const openPanel = () => {
    store.isOpen = true;
    panel.setOpen(true);
    panel.input.focus();
  };

  const closePanel = () => {
    store.isOpen = false;
    panel.setOpen(false);
  };

  panel.trigger.addEventListener("click", () => {
    if (store.isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  panel.closeButton.addEventListener("click", closePanel);

  panel.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = panel.input.value.trim();

    if (!message || store.isLoading) {
      return;
    }

    addUserMessage(store, message);
    panel.renderMessages(store);
    panel.input.value = "";
    panel.setLoading(true);
    panel.setStatus("Searching the official Videoinu knowledge base...");
    store.isLoading = true;

    try {
      const payload = {
        message,
        context: derivePageContext(),
        session: {
          id: store.sessionId,
        },
        client: {
          locale: navigator.language || "en-US",
        },
      };

      const response = await sendChatMessage(payload);

      if (!response.ok && response.message) {
        addAssistantMessage(store, {
          text: response.message,
          citations: response.citations || [],
          feedbackToken: response.feedbackToken || null,
        });
      } else {
        addAssistantMessage(store, {
          text: response.answer || response.message,
          citations: response.citations || [],
          feedbackToken: response.feedbackToken || null,
          requestId: response.requestId || null,
        });
      }

      panel.setStatus("Responses are concise and citation-backed.");
      panel.renderMessages(store);
    } catch (error) {
      addAssistantMessage(store, {
        text: "The Videoinu assistant is temporarily unavailable. Please try again shortly.",
        citations: [],
      });
      panel.setStatus("The assistant is temporarily unavailable.");
      panel.renderMessages(store);
    } finally {
      store.isLoading = false;
      panel.setLoading(false);
    }
  });

  panel.meta.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const starterQuestion = target.dataset.starterQuestion;

    if (starterQuestion) {
      panel.input.value = starterQuestion;
      panel.input.focus();
    }
  });

  panel.messages.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const rating = target.dataset.feedbackRating;
    const reason = target.dataset.feedbackReason || null;
    const feedbackContainer = target.closest("[data-feedback-token]");
    const feedbackToken = feedbackContainer?.getAttribute("data-feedback-token");

    if (!rating || !feedbackToken) {
      return;
    }

    if (rating === "not_helpful" && !reason) {
      updateFeedbackState(store, feedbackToken, "reason-picker");
      panel.renderMessages(store);
      return;
    }

    try {
      await sendFeedback({
        feedbackToken,
        rating,
        reason,
      });
    } finally {
      updateFeedbackState(store, feedbackToken, "sent");
      panel.renderMessages(store);
    }
  });
}
