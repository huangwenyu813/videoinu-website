const DEFAULT_ASSISTANT_VERSION = "phase1.0.0";
const DEFAULT_KB_VERSION = "kb.2026-05-16.1";
const DEFAULT_PROMPT_VERSION = "prompt.phase1.v1";

export function getAssistantVersions(env = {}) {
  return {
    assistantVersion: env.ASSISTANT_VERSION || DEFAULT_ASSISTANT_VERSION,
    kbVersion: env.KB_VERSION || DEFAULT_KB_VERSION,
    promptVersion: env.PROMPT_VERSION || DEFAULT_PROMPT_VERSION,
  };
}
