# Buck2Bar — Income & Expense

Simple static page to enter monthly income and expense values (Jan–Dec) and view a grouped bar chart.

How to use
- Open `index.html` in a browser.
- Enter numbers (decimals allowed) in the `Data` tab and click `Update Chart`.
- Data is saved to `localStorage` automatically.
- Click `Reset` to clear values and reset the chart.

Files
- `index.html` — Main page with tabs and inputs.
- `css/styles.css` — Minimal custom styles.
- `js/chart.js` — Chart.js initialization and update API.
- `js/main.js` — Input handling, persistence, and button wiring.
