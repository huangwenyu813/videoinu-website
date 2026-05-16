import { createOpenAiResponse } from "./openai.js";

const DEFAULT_MODEL = "gpt-4.1-mini";
const DEFAULT_SCORE_THRESHOLD = 0.72;
const HIGH_CONFIDENCE_THRESHOLD = 0.84;
const MEDIUM_CONFIDENCE_THRESHOLD = 0.72;

function buildUserPrompt(message, contextData) {
  const contextLines = [
    `Current page: ${contextData.currentPage || "unknown"}`,
    `Current feature: ${contextData.currentFeature || "unknown"}`,
    `Current model: ${contextData.currentModel || "unknown"}`,
    `Entry point: ${contextData.entryPoint || "floating-chat"}`,
    `UI language: ${contextData.uiLanguage || "en"}`,
  ];

  return `User question: ${message}\n\nPage context:\n${contextLines.join("\n")}`;
}

function collectFileSearchResults(response) {
  const outputItems = Array.isArray(response.output) ? response.output : [];

  return outputItems
    .filter((item) => item.type === "file_search_call" && Array.isArray(item.results))
    .flatMap((item) => item.results);
}

function normalizeCitation(result) {
  const attributes = result.attributes || {};
  const title = attributes.title || result.filename || result.file_name || "Knowledge Source";

  return {
    id: attributes.id || result.file_id || title.toLowerCase().replace(/\s+/g, "_"),
    title,
    path: attributes.path || result.filename || "",
    section: attributes.section || "Reference",
    snippet: String(result.text || "").trim().slice(0, 220),
    score: typeof result.score === "number" ? Number(result.score.toFixed(3)) : null,
  };
}

function deriveRetrievalStatus(results) {
  if (!results.length) {
    return "none";
  }

  const topScore = typeof results[0].score === "number" ? results[0].score : 0;

  if (topScore >= HIGH_CONFIDENCE_THRESHOLD) {
    return "high";
  }

  if (topScore >= MEDIUM_CONFIDENCE_THRESHOLD) {
    return "medium";
  }

  return "low";
}

function buildSuggestedQuestions(contextData) {
  if (contextData.currentModel) {
    return [
      `How should I use ${contextData.currentModel}?`,
      "Which workflow fits this model best?",
    ];
  }

  if (contextData.currentFeature) {
    return [
      `How do I use ${contextData.currentFeature}?`,
      "What should I do next in this workflow?",
    ];
  }

  return [
    "How do I create my first video?",
    "How do I export a finished video?",
  ];
}

export async function fetchAssistantResponse({
  env,
  prompt,
  message,
  contextData,
  requestTimeoutMs,
}) {
  const payload = {
    model: env.OPENAI_MODEL || DEFAULT_MODEL,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildUserPrompt(message, contextData),
          },
        ],
      },
    ],
    tools: [
      {
        type: "file_search",
        vector_store_ids: [env.OPENAI_VECTOR_STORE_ID],
        max_num_results: Number(env.FILE_SEARCH_MAX_RESULTS || 6),
        ranking_options: {
          score_threshold: Number(env.FILE_SEARCH_SCORE_THRESHOLD || DEFAULT_SCORE_THRESHOLD),
        },
        filters: {
          type: "eq",
          key: "status",
          value: "published",
        },
      },
    ],
    include: ["file_search_call.results"],
    temperature: 0.2,
  };

  const response = await createOpenAiResponse({
    apiKey: env.OPENAI_API_KEY,
    payload,
    timeoutMs: requestTimeoutMs,
  });

  const rawResults = collectFileSearchResults(response);
  const citations = rawResults.map(normalizeCitation).slice(0, 4);
  const retrievalStatus = deriveRetrievalStatus(rawResults);
  const answer = String(response.output_text || "").trim();

  return {
    answer:
      answer ||
      "I found relevant Videoinu references, but I do not have enough grounded information to answer this clearly yet.",
    citations,
    retrievalStatus,
    suggestedQuestions: buildSuggestedQuestions(contextData),
  };
}
