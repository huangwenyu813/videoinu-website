export const contextPrompt = `
You may use page context such as currentPage, currentFeature, currentModel, entryPoint, and uiLanguage as hints about what the user is looking at.
Treat page context as auxiliary information only, not as a source of truth.
If page context conflicts with the knowledge base, follow the knowledge base.
`.trim();
