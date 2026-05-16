export const feedbackRequestSchema = {
  feedbackToken: "string",
  requestId: "string|null",
  rating: "helpful|not_helpful",
  reason: "incorrect|unclear|too_long|missing_info|hallucination|null",
};
