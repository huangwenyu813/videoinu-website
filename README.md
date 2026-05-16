# Videoinu 2.0 Website

Videoinu 2.0 marketing site with a Phase 1 product help assistant built for Cloudflare Pages + Pages Functions.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Cloudflare Pages Functions
- OpenAI Responses API + File Search

## Run Locally

Use Wrangler so the local environment includes Pages Functions:

```bash
npm run dev
```

Then visit:

```text
http://127.0.0.1:4173
```

## Required Production Environment Variables

Set these in Cloudflare Pages:

- `OPENAI_API_KEY`
- `OPENAI_VECTOR_STORE_ID`

Optional:

- `OPENAI_MODEL`
- `FILE_SEARCH_MAX_RESULTS`
- `FILE_SEARCH_SCORE_THRESHOLD`
- `ASSISTANT_VERSION`
- `KB_VERSION`
- `PROMPT_VERSION`

Optional binding for stronger production rate limiting:

- `ASSISTANT_RATE_LIMIT_KV`

## Project Structure

```text
test_videoinu_web/
├── assets/
├── docs/
├── functions/
│   └── api/
├── knowledge/
├── server/
├── src/
│   └── assistant/
├── index.html
├── package.json
└── README.md
```

## File Roles

- `index.html`: Static page entry.
- `src/main.js`: Homepage rendering and assistant mount.
- `src/assistant/`: Chat widget UI, store, and API client.
- `src/styles.css`: Site styles plus assistant styles.
- `functions/api/chat.js`: Main assistant endpoint.
- `functions/api/config.js`: Frontend assistant config.
- `functions/api/feedback.js`: Helpful / not helpful endpoint.
- `functions/api/health.js`: Health and version info.
- `server/prompt/`: Modular prompt definitions.
- `server/lib/`: Boundaries, rate limit, OpenAI, fallback, logging.
- `knowledge/`: Source markdown docs and registry for the assistant knowledge base.
- `docs/`: Capability boundaries and KB update workflow.

## Phase 1 Assistant Scope

Included:

- homepage chat entry
- `/api/chat`
- OpenAI File Search integration
- product help Q&A
- citations
- logging and analytics events
- helpful / not helpful feedback
- IP-based rate limiting
- graceful fallback responses

Explicitly excluded:

- streaming
- multi-turn memory
- tool orchestration
- project-aware context
- autonomous tasks
- open-ended chat
