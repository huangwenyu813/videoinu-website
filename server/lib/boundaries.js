const OFF_TOPIC_PATTERNS = [
  /\b(joke|weather|horoscope|movie recommendation|song recommendation)\b/i,
  /\b(politics|president|election|lawyer|diagnosis|medical|therapy)\b/i,
  /\b(code|javascript|python|react bug|sql|algorithm)\b/i,
  /^(hi|hello|hey|yo|good morning|good evening)[!.? ]*$/i,
  /who are you\??$/i,
];

const TROUBLESHOOTING_PATTERNS = [
  /\b(fail|failed|error|bug|issue|not working|stuck|slow|broken|problem)\b/i,
];

const WORKFLOW_PATTERNS = [
  /\b(workflow|pipeline|process|steps|start|first video|storyboard|consistency)\b/i,
];

export function classifyMessageScope(message) {
  if (!message || !message.trim()) {
    return { category: "out_of_scope" };
  }

  if (OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(message))) {
    return { category: "out_of_scope" };
  }

  if (TROUBLESHOOTING_PATTERNS.some((pattern) => pattern.test(message))) {
    return { category: "troubleshooting" };
  }

  if (WORKFLOW_PATTERNS.some((pattern) => pattern.test(message))) {
    return { category: "workflow_guidance" };
  }

  return { category: "product_usage" };
}
