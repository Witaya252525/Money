# AGENTS.md — Agent definitions for this repository

Overview
- This document lists the agents and their responsibilities when interacting with the Money project.

Primary agent: GitHub Agent
- Role: Assist with code changes, PR creation, documentation updates, and issue triage for this repository.
- Scope: Repository root and all source files in this project.
- Capabilities:
  - Edit repository files and create small, focused patches.
  - Open pull requests with clear titles and descriptions.
  - Run `npm` scripts defined in `package.json` when requested (e.g., linters, formatters, build steps).
  - Update documentation (`README.md`) and add changelog entries when appropriate.
  - Create or label issues for ambiguous requirements or missing assets.
- Constraints & rules:
  - Never add secrets or credentials to the repository.
  - Keep changes minimal and revertible; prefer multiple small PRs over one large PR.
  - Run formatters/linters if configured before proposing changes.

Project entities mapping
- `index.html`: Entry point — UI layout and markup.
- `css/styles.css`: Visual styling and responsive rules.
- `js/app.js`: Front-end JavaScript logic and event handling.
- `package.json`: NPM metadata; scripts for dev tasks.
- `README.md`: Usage, setup, and developer notes.

Technology stack
- HTML — document structure and templating.
- CSS — styling and layout (plain CSS files under `css/`).
- JavaScript — client-side behavior (`js/` folder).
- Node / npm — development scripts and tooling via `package.json`.

Invocation examples (how to prompt the agent)
- "GitHub Agent: create a PR that fixes the layout on mobile screens in `css/styles.css`."
- "GitHub Agent: add input validation to `js/app.js` and update `README.md` with usage notes."

Notes for maintainers
- If you add new build or test tooling, update this file to document available agent actions and new `npm` scripts.
