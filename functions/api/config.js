import { json } from "../../server/lib/http.js";
import { getAssistantVersions } from "../../server/lib/versions.js";

const DEFAULT_STARTER_QUESTIONS = [
  "How do I create my first video?",
  "How do I choose the right model?",
  "How do I export a finished video?",
  "Why did my generation fail?",
];

export async function onRequestGet(context) {
  const versions = getAssistantVersions(context.env);

  return json(
    {
      enabled: true,
      title: "Videoinu Assistant",
      placeholder: "Ask how to use Videoinu 2.0...",
      scopeNotice: "This assistant only answers official Videoinu 2.0 usage questions.",
      starterQuestions: DEFAULT_STARTER_QUESTIONS,
      responseMode: "request-response",
      streaming: false,
      ...versions,
    },
    200,
  );
}
