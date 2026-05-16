export const chatResponseSchema = {
  ok: "boolean",
  answer: "string",
  category: "string",
  citations: "array",
  suggestedQuestions: "array",
  feedbackToken: "string",
  requestId: "string",
  retrievalStatus: "string",
  scope: "string",
  assistantVersion: "string",
  kbVersion: "string",
  promptVersion: "string",
};
