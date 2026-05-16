# Knowledge Base Update Workflow

## Goal
Keep the assistant knowledge accurate without adding heavy operational complexity.

## Workflow
1. Update or add markdown files under `knowledge/`.
2. Update `knowledge/registry.json`.
3. Set each document status correctly.
4. Only upload `published` documents to the OpenAI vector store.
5. Update the deployed `KB_VERSION`.
6. Run a smoke test against 5 to 10 high-frequency questions.

## Required metadata
- title
- path
- type
- status
- lastUpdated
- version

## Publishing rule
Only `published` content is eligible for retrieval.

## Recommended smoke tests
- first video flow
- model selection
- export steps
- generation failure
- quality troubleshooting
