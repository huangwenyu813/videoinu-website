import { json } from "../../server/lib/http.js";
import { logEvent } from "../../server/lib/logging.js";
import { FEEDBACK_REASON_ENUMS, parseFeedbackPayload } from "../../server/lib/validators.js";
import { getAssistantVersions } from "../../server/lib/versions.js";

export async function onRequestPost(context) {
  try {
    const payload = await parseFeedbackPayload(context.request);
    const versions = getAssistantVersions(context.env);

    if (!payload.feedbackToken) {
      return json(
        {
          ok: false,
          error: "invalid_feedback",
          message: "Missing feedback token.",
          validReasons: FEEDBACK_REASON_ENUMS,
          ...versions,
        },
        400,
      );
    }

    logEvent("assistant_feedback", {
      feedbackToken: payload.feedbackToken,
      rating: payload.rating,
      reason: payload.reason ?? null,
      requestId: payload.requestId ?? null,
      ...versions,
    });

    return json(
      {
        ok: true,
        message: "Feedback recorded.",
        ...versions,
      },
      200,
    );
  } catch (error) {
    return json(
      {
        ok: false,
        error: "invalid_feedback",
        message: "Could not record feedback.",
      },
      400,
    );
  }
}
