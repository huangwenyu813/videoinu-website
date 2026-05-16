export const chatRequestSchema = {
  message: "string",
  context: {
    currentPage: "string",
    currentFeature: "string|null",
    currentModel: "string|null",
    entryPoint: "string",
    uiLanguage: "string",
  },
  session: {
    id: "string",
  },
  client: {
    locale: "string",
  },
};
