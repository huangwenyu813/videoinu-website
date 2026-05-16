import { FEEDBACK_REASONS } from "./chat-types.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCitations(citations) {
  if (!citations?.length) {
    return "";
  }

  return `
    <details class="assistant-sources">
      <summary>Sources (${citations.length})</summary>
      <ul>
        ${citations
          .map(
            (citation) => `
              <li>
                <strong>${escapeHtml(citation.title)}</strong>
                <span>${escapeHtml(citation.section || "Reference")}</span>
              </li>
            `,
          )
          .join("")}
      </ul>
    </details>
  `;
}

function renderFeedback(message) {
  if (message.role !== "assistant" || !message.feedbackToken || message.feedbackState) {
    return "";
  }

  return `
    <div class="assistant-feedback" data-feedback-token="${escapeHtml(message.feedbackToken)}">
      <button type="button" data-feedback-rating="helpful">Helpful</button>
      <button type="button" data-feedback-rating="not_helpful">Not helpful</button>
    </div>
  `;
}

function renderFeedbackReasonPicker(message) {
  if (message.role !== "assistant" || message.feedbackState !== "reason-picker") {
    return "";
  }

  return `
    <div class="assistant-feedback assistant-feedback-reasons" data-feedback-token="${escapeHtml(message.feedbackToken)}">
      ${FEEDBACK_REASONS.map(
        (reason) => `
          <button type="button" data-feedback-rating="not_helpful" data-feedback-reason="${reason.value}">
            ${escapeHtml(reason.label)}
          </button>
        `,
      ).join("")}
    </div>
  `;
}

function renderFeedbackSent(message) {
  if (message.role !== "assistant" || message.feedbackState !== "sent") {
    return "";
  }

  return `<p class="assistant-feedback-sent">Thanks. Your feedback was recorded.</p>`;
}

function renderMessage(message) {
  return `
    <article class="assistant-message assistant-message-${message.role}">
      <div class="assistant-message-body">
        <p>${escapeHtml(message.text).replaceAll("\n", "<br />")}</p>
        ${renderCitations(message.citations)}
        ${renderFeedback(message)}
        ${renderFeedbackReasonPicker(message)}
        ${renderFeedbackSent(message)}
      </div>
    </article>
  `;
}

function renderStarterQuestions(config) {
  return `
    <div class="assistant-starters">
      ${config.starterQuestions
        .map(
          (question) => `
            <button type="button" class="assistant-starter" data-starter-question="${escapeHtml(question)}">
              ${escapeHtml(question)}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

export function createChatPanel() {
  const wrapper = document.createElement("div");
  wrapper.className = "assistant-shell";
  wrapper.innerHTML = `
    <button type="button" class="assistant-trigger" aria-expanded="false" aria-controls="assistant-panel">
      <span class="assistant-trigger-badge">AI</span>
      <span class="assistant-trigger-label">Ask Videoinu</span>
    </button>

    <section class="assistant-panel" id="assistant-panel" hidden>
      <header class="assistant-panel-header">
        <div>
          <strong>Videoinu Assistant</strong>
          <p>This assistant only answers official Videoinu 2.0 usage questions.</p>
        </div>
        <button type="button" class="assistant-close" aria-label="Close assistant">Close</button>
      </header>

      <div class="assistant-meta"></div>
      <div class="assistant-messages"></div>
      <form class="assistant-form">
        <label class="assistant-label" for="assistant-input">Ask a Videoinu 2.0 question</label>
        <textarea id="assistant-input" name="message" rows="3" maxlength="1200" placeholder="Ask how to use Videoinu 2.0..."></textarea>
        <div class="assistant-form-footer">
          <span class="assistant-status">Responses are concise and citation-backed.</span>
          <button type="submit" class="assistant-submit">Send</button>
        </div>
      </form>
    </section>
  `;

  const trigger = wrapper.querySelector(".assistant-trigger");
  const panel = wrapper.querySelector(".assistant-panel");
  const closeButton = wrapper.querySelector(".assistant-close");
  const form = wrapper.querySelector(".assistant-form");
  const input = wrapper.querySelector("#assistant-input");
  const messages = wrapper.querySelector(".assistant-messages");
  const meta = wrapper.querySelector(".assistant-meta");
  const submit = wrapper.querySelector(".assistant-submit");

  return {
    element: wrapper,
    trigger,
    panel,
    closeButton,
    form,
    input,
    messages,
    meta,
    submit,
    renderConfig(config) {
      panel.querySelector(".assistant-panel-header strong").textContent = config.title;
      panel.querySelector(".assistant-panel-header p").textContent = config.scopeNotice;
      input.placeholder = config.placeholder;
      meta.innerHTML = renderStarterQuestions(config);
    },
    renderMessages(state) {
      messages.innerHTML = state.messages.map(renderMessage).join("");
      messages.scrollTop = messages.scrollHeight;
    },
    setOpen(nextOpen) {
      trigger.setAttribute("aria-expanded", String(nextOpen));
      panel.hidden = !nextOpen;
      wrapper.classList.toggle("assistant-shell-open", nextOpen);
    },
    setLoading(isLoading) {
      submit.disabled = isLoading;
      input.disabled = isLoading;
      submit.textContent = isLoading ? "Thinking..." : "Send";
    },
    setStatus(text) {
      const statusNode = panel.querySelector(".assistant-status");
      statusNode.textContent = text;
    },
  };
}
