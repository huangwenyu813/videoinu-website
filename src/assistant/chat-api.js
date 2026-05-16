import { FALLBACK_STARTER_QUESTIONS } from "./chat-types.js";

export async function fetchAssistantConfig() {
  try {
    const response = await fetch("/api/config", {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("config_request_failed");
    }

    return response.json();
  } catch (error) {
    return {
      enabled: true,
      title: "Videoinu Assistant",
      placeholder: "Ask how to use Videoinu 2.0...",
      scopeNotice: "This assistant only answers official Videoinu 2.0 usage questions.",
      starterQuestions: FALLBACK_STARTER_QUESTIONS,
      responseMode: "request-response",
      streaming: false,
    };
  }
}

export async function sendChatMessage(payload) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function sendFeedback(payload) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}
