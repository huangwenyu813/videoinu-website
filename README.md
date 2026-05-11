# Videoinu 2.0 Landing Page

Videoinu 2.0 static single-page website restored for local preview and iteration.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Run Locally

Open `index.html` directly, or run a local static server:

```bash
python3 -m http.server 4173
```

Then visit:

```text
http://127.0.0.1:4173
```

## Project Structure

```text
test_videoinu_web/
├── assets/
│   └── favicon.svg
├── src/
│   ├── main.js
│   └── styles.css
├── index.html
└── README.md
```

## File Roles

- `index.html`: Static page entry, metadata, stylesheet, and script loading.
- `src/main.js`: Page content, section structure, responsive mobile menu behavior, and cursor glow interaction.
- `src/styles.css`: Global reset, layout, responsive rules, visual styling, and video presentation.
- `assets/favicon.svg`: Browser favicon.
