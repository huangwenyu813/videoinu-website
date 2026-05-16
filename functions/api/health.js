import { json } from "../../server/lib/http.js";
import { getAssistantVersions } from "../../server/lib/versions.js";

export async function onRequestGet(context) {
  const versions = getAssistantVersions(context.env);

  return json(
    {
      ok: true,
      service: "videoinu-product-help-assistant",
      mode: "phase-1",
      streaming: false,
      openAiConfigured: Boolean(context.env.OPENAI_API_KEY && context.env.OPENAI_VECTOR_STORE_ID),
      rateLimitStorage: context.env.ASSISTANT_RATE_LIMIT_KV ? "kv" : "memory",
      ...versions,
    },
    200,
  );
}
