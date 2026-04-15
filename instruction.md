# GitHub Agent Instructions

Purpose
- Provide guidance for an automated GitHub agent (or human reviewer) working on this repository.

Project overview
- Repository: Money (static front-end project)
- Key files: `index.html`, `css/styles.css`, `js/app.js`, `package.json`, `README.md`

Entities
- `index.html`: App entry / UI shell
- `css/styles.css`: Styling rules and layout
- `js/app.js`: Client-side behavior and UI logic
- `package.json`: Project metadata and npm scripts (dev tools, linters, build steps)
- `README.md`: Project description and usage

Agent responsibilities
- Make focused code changes using small, self-contained patches.
- Update or create tests or validation steps if introduced.
- Update `README.md` when functionality or usage changes.
- Respect coding conventions; run formatters or linters if configured (`package.json` scripts).
- Open issues for unclear requirements or missing assets.

Behavior rules
- Prefer minimal, well-explained commits/patches rather than broad sweeping changes.
- When creating or modifying files, include a brief summary and rationale in the commit/PR description.
- Do not remove unrelated files. If a refactor touches multiple modules, split into multiple PRs.

Suggested prompts for the agent
- "Add a feature to `js/app.js` to validate the input and show an error message." 
- "Fix responsive layout issues for small screens in `css/styles.css`." 
- "Add an npm script to run the linter and document it in `README.md`."

Security & privacy
- Do not add secrets, API keys, or credentials to the repository. Create environment-aware configs if needed.

Location
- This file documents high-level guidance for the agent and maintainers.
