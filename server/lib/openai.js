const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

export async function createOpenAiResponse({ apiKey, payload, timeoutMs }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("timeout"), timeoutMs);

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`openai_api_failure:${response.status}:${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (String(error).includes("timeout") || error?.name === "AbortError") {
      throw new Error("timeout");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
