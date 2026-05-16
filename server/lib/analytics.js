import { logEvent } from "./logging.js";

export function trackChatEvent(event, payload) {
  logEvent(event, payload);
}
