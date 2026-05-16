import { buildPrompt } from "../../server/prompt/composer.js";
import { classifyMessageScope } from "../../server/lib/boundaries.js";
import { json, withNoStoreHeaders } from "../../server/lib/http.js";
import { trackChatEvent } from "../../server/lib/analytics.js";
import { buildAssistantUnavailableResponse, buildKnowledgeFallbackResponse, buildTimeoutResponse } from "../../server/lib/fallbacks.js";
import { fetchAssistantResponse } from "../../server/lib/file-search.js";
import { logEvent } from "../../server/lib/logging.js";
import { enforceRateLimit, getClientIpHash, getRequestId } from "../../server/lib/rate-limit.js";
import { parseChatPayload } from "../../server/lib/validators.js";
import { getAssistantVersions } from "../../server/lib/versions.js";

const REQUEST_TIMEOUT_MS = 14000;

function createFeedbackToken(requestId) {
  return `fb_${requestId}`;
}

export async function onRequestPost(context) {
  const startedAt = Date.now();
  const requestId = getRequestId();
  const versions = getAssistantVersions(context.env);
  const ipHash = await getClientIpHash(context.request);

  try {
    const rateLimit = await enforceRateLimit({
      env: context.env,
      ipHash,
      requestId,
    });

    if (!rateLimit.ok) {
      trackChatEvent("chat_rate_limited", {
        requestId,
        ipHash,
        ...versions,
      });

      return withNoStoreHeaders(
        json(
          {
            ok: false,
            error: "rate_limited",
            message: "Too many requests. Please try again shortly.",
            requestId,
            ...versions,
          },
          429,
        ),
      );
    }

    const payload = await parseChatPayload(context.request);
    const scope = classifyMessageScope(payload.message);

    if (scope.category === "out_of_scope") {
      const body = {
        ok: true,
        answer:
          "I can only help with official Videoinu 2.0 usage questions. Ask about features, workflows, models, exporting, or troubleshooting.",
        category: scope.category,
        citations: [],
        suggestedQuestions: [
          "How do I create my first video?",
          "How do I choose the right model?",
          "Why did my generation fail?",
        ],
        feedbackToken: createFeedbackToken(requestId),
        requestId,
        retrievalStatus: "none",
        scope: "videoinu-only",
        ...versions,
      };

      trackChatEvent("chat_scope_rejected", {
        requestId,
        ipHash,
        messageLength: payload.message.length,
        category: scope.category,
        ...versions,
      });

      return withNoStoreHeaders(json(body, 200));
    }

    if (!context.env.OPENAI_API_KEY || !context.env.OPENAI_VECTOR_STORE_ID) {
      const response = buildAssistantUnavailableResponse({
        requestId,
        category: scope.category,
        ...versions,
      });

      trackChatEvent("chat_missing_configuration", {
        requestId,
        ipHash,
        category: scope.category,
        ...versions,
      });

      return withNoStoreHeaders(json(response, 503));
    }

    const prompt = buildPrompt();
    const openAiResult = await fetchAssistantResponse({
      env: context.env,
      prompt,
      message: payload.message,
      contextData: payload.context,
      requestTimeoutMs: REQUEST_TIMEOUT_MS,
    });

    if (openAiResult.retrievalStatus === "none" || openAiResult.retrievalStatus === "low") {
      const fallback = buildKnowledgeFallbackResponse({
        requestId,
        category: scope.category,
        ...versions,
      });

      trackChatEvent("chat_low_confidence_fallback", {
        requestId,
        ipHash,
        category: scope.category,
        retrievalStatus: openAiResult.retrievalStatus,
        citationsCount: openAiResult.citations.length,
        latencyMs: Date.now() - startedAt,
        ...versions,
      });

      return withNoStoreHeaders(json(fallback, 200));
    }

    const responseBody = {
      ok: true,
      answer: openAiResult.answer,
      category: scope.category,
      citations: openAiResult.citations,
      suggestedQuestions: openAiResult.suggestedQuestions,
      feedbackToken: createFeedbackToken(requestId),
      requestId,
      retrievalStatus: openAiResult.retrievalStatus,
      scope: "videoinu-only",
      ...versions,
    };

    trackChatEvent("chat_response", {
      requestId,
      ipHash,
      messageLength: payload.message.length,
      category: scope.category,
      retrievalStatus: openAiResult.retrievalStatus,
      citationsCount: openAiResult.citations.length,
      latencyMs: Date.now() - startedAt,
      context: payload.context,
      ...versions,
    });

    return withNoStoreHeaders(json(responseBody, 200));
  } catch (error) {
    const normalizedMessage = String(error?.message || "");
    const isTimeout = normalizedMessage.includes("timeout");
    const isOpenAiError = normalizedMessage.includes("openai_");
    const isValidationError = normalizedMessage.includes("invalid_");

    logEvent("assistant_chat_error", {
      requestId,
      ipHash,
      errorMessage: normalizedMessage,
      errorName: error?.name ?? "Error",
      ...versions,
    });

    const fallback = isTimeout
      ? buildTimeoutResponse({
          requestId,
          category: "assistant_unavailable",
          ...versions,
        })
      : isValidationError
        ? {
            ok: false,
            error: "invalid_request",
            message: "Please ask one clear Videoinu 2.0 usage question.",
            requestId,
            ...versions,
          }
      : buildAssistantUnavailableResponse({
          requestId,
          category: isOpenAiError ? "assistant_unavailable" : "invalid_request",
          ...versions,
        });

    return withNoStoreHeaders(json(fallback, isTimeout ? 504 : isValidationError ? 400 : 503));
  }
}
