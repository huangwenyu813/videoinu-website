export function logEvent(event, payload) {
  console.log(
    JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      ...payload,
    }),
  );
}
