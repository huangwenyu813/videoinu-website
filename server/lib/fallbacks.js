export function buildAssistantUnavailableResponse(base) {
  return {
    ok: false,
    error: "assistant_unavailable",
    message: "The Videoinu assistant is temporarily unavailable. Please try again shortly.",
    citations: [],
    suggestedQuestions: [
      "How do I create my first video?",
      "How do I export a finished video?",
    ],
    ...base,
  };
}

export function buildTimeoutResponse(base) {
  return {
    ok: false,
    error: "timeout",
    message: "The assistant took too long to respond. Please try again.",
    citations: [],
    suggestedQuestions: [
      "How do I choose the right model?",
      "Why did my generation fail?",
    ],
    ...base,
  };
}

export function buildKnowledgeFallbackResponse(base) {
  return {
    ok: true,
    answer:
      "I couldn’t find enough official Videoinu knowledge to answer this accurately. Please ask about a specific feature, workflow, model, export step, or troubleshooting issue.",
    citations: [],
    suggestedQuestions: [
      "How do I create my first video?",
      "How do I choose the right model?",
      "How do I export a finished video?",
    ],
    ...base,
  };
}
