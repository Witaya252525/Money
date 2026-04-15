---
name: copilot-instructions
summary: Workspace instructions for AI assistants working on this Money project.
---

# Workspace AI Instructions

- Project: Money — simple frontend app (HTML/CSS/JS).
- Entry: [index.html](index.html)
- Key files:
  - [css/styles.css](css/styles.css)
  - [js/app.js](js/app.js)
  - [AGENTS.md](AGENTS.md)

## Purpose
Help contributors with small code changes, bug fixes, UI tweaks, and documentation updates. Prefer small, focused patches and preserve existing patterns.

## How to run / test
- No build step: open `index.html` in a browser for manual testing.
- Use `package.json` scripts if present for linters or formatters.

## Conventions
- Keep changes minimal and reversible.
- Edit only files relevant to the issue unless asked otherwise.
- Preserve existing coding style; follow surrounding patterns.

## When to load
- Use when editing files under `css/`, `js/`, or top-level docs.

## Example prompts
- "Add mobile-friendly spacing to the header in `css/styles.css`."
- "Fix an input validation bug in `js/app.js` and add a short README note."

## Next suggestions
- Add `applyTo` patterns if you want instructions limited to `css/` or `js/` only.
- Create prompts for common tasks (e.g., `fix-css-bug.prompt.md`).
