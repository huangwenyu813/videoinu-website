export function createChatStore() {
  const sessionId = `anon_${crypto.randomUUID()}`;

  return {
    isOpen: false,
    isLoading: false,
    config: null,
    sessionId,
    messages: [],
  };
}
