export function json(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

export function withNoStoreHeaders(response) {
  response.headers.set("cache-control", "no-store");
  return response;
}
