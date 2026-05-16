export const FEEDBACK_REASON_ENUMS = ["incorrect", "unclear", "too_long", "missing_info", "hallucination"];

function ensureString(value, fallback = "", maxLength = 240) {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().slice(0, maxLength);
}

export async function parseChatPayload(request) {
  const body = await request.json();
  const message = ensureString(body.message, "", 1200);

  if (!message) {
    throw new Error("invalid_message");
  }

  return {
    message,
    context: {
      currentPage: ensureString(body.context?.currentPage, "homepage", 120),
      currentFeature: ensureString(body.context?.currentFeature, "", 120) || null,
      currentModel: ensureString(body.context?.currentModel, "", 120) || null,
      entryPoint: ensureString(body.context?.entryPoint, "floating-chat", 64),
      uiLanguage: ensureString(body.context?.uiLanguage, body.client?.locale || "en", 24),
    },
    session: {
      id: ensureString(body.session?.id, "anonymous", 120),
    },
    client: {
      locale: ensureString(body.client?.locale, "en", 24),
    },
  };
}

export async function parseFeedbackPayload(request) {
  const body = await request.json();
  const rating = ensureString(body.rating, "", 24);
  const reason = ensureString(body.reason, "", 40) || null;

  if (!["helpful", "not_helpful"].includes(rating)) {
    throw new Error("invalid_rating");
  }

  if (rating === "not_helpful" && reason && !FEEDBACK_REASON_ENUMS.includes(reason)) {
    throw new Error("invalid_reason");
  }

  return {
    feedbackToken: ensureString(body.feedbackToken, "", 120),
    requestId: ensureString(body.requestId, "", 120) || null,
    rating,
    reason,
  };
}
