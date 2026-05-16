import { contextPrompt } from "./context.js";
import { identityPrompt } from "./identity.js";
import { outputPrompt } from "./output.js";
import { retrievalPrompt } from "./retrieval.js";
import { scopePrompt } from "./scope.js";

export function buildPrompt() {
  return [identityPrompt, scopePrompt, retrievalPrompt, contextPrompt, outputPrompt].join("\n\n");
}
