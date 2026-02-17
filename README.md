# OpenCard

A visual baseball scorecard builder. Customize every detail with a live preview, then print or share.

**No account needed. Runs in your browser. Fully open source.**

## Features

- **Visual editor** — tweak colors, fonts, grid size, stat columns, and more with a form UI
- **Live preview** — see changes instantly as you edit
- **Presets** — start from Classic Blue, Minimal B&W, Retro Green, or Dark Mode
- **Persistence** — your changes are saved to localStorage automatically
- **Sharing** — generate a compressed URL and share your scorecard with anyone
- **JSON editor** — switch to raw JSON for full control over every config field
- **Print-ready** — open in a new window and print with optimized styles
- **Export/Import** — download your config as JSON, load it back anytime

## Get Started

Visit the live app: `https://gkuhlman.github.io/opencard/`

Or run locally:

```bash
git clone https://github.com/gkuhlman/opencard.git
cd opencard
npm install
npm run dev
```

## Config Reference

The scorecard is driven by a JSON config. The visual editor covers all fields, but you can also edit the JSON directly. Every field is optional — only specify what you want to change from the defaults.

### Theme

Colors, fonts, and sizing for the scorecard layout.

```json
{
  "theme": {
    "colors": {
      "primary": "#3a9bd5",
      "primaryLight": "#b8ddf0",
      "primaryFaint": "#eaf5fb",
      "ink": "#2c3e50",
      "background": "#fdfdfd",
      "border": "#a5d4e8"
    },
    "fonts": {
      "display": "Barlow Condensed",
      "body": "Barlow"
    },
    "sizing": {
      "inningCellWidth": 64,
      "rowHeight": 66,
      "playerColWidth": 110
    }
  }
}
```

### Grid

```json
{
  "grid": {
    "rows": 10,
    "innings": 12,
    "substitutionLine": false,
    "statColumns": [
      { "key": "AB", "label": "AB" },
      { "key": "R", "label": "R" },
      { "key": "H", "label": "H" },
      { "key": "RBI", "label": "RBI" }
    ]
  }
}
```

### Cell (At-Bat)

```json
{
  "cell": {
    "outcomes": {
      "show": true,
      "items": ["1B", "2B", "3B", "HR", "BB"]
    },
    "diamond": {
      "show": true,
      "maxSize": 42
    },
    "count": {
      "show": true,
      "balls": 3,
      "strikes": 2
    }
  }
}
```

### Pitchers

```json
{
  "pitchers": {
    "rows": 5,
    "stats": [
      { "key": "IP", "label": "IP" },
      { "key": "H", "label": "H" },
      { "key": "R", "label": "R" },
      { "key": "ER", "label": "ER" },
      { "key": "BB", "label": "BB" },
      { "key": "K", "label": "K" }
    ]
  }
}
```

## Printing

Click **Print** in the toolbar to open the scorecard in a new window with print-optimized styles. For best results:

- Set margins to **Minimum** or **None**
- Enable **Background graphics** for shaded stat columns

## Contributing

Contributions are welcome! Here's how to get started:

```bash
git clone https://github.com/gkuhlman/opencard.git
cd opencard
npm install
npm run dev      # start dev server
npm test         # run tests
```

### Project structure

- `src/engine/` — Pure functions that generate the scorecard HTML. This is the core — changes here should include tests.
- `src/engine/defaults.json` — Default config values. Every field a user can customize lives here.
- `src/hooks/useConfig.js` — React hook managing config state, localStorage, and URL sharing.
- `src/components/` — React UI components (form editor, preview, preset picker).
- `src/presets.js` — Template definitions (layout + color combinations).

### Guidelines

- **Add tests** for any changes to the engine (`src/engine/`). Run `npm test` before submitting.
- **Keep configs backwards-compatible.** New fields should have defaults so existing shared URLs and saved configs still work.
- **Templates and presets** are a great first contribution — add new color palettes or layout templates in `src/presets.js`.

### Submitting a PR

1. Fork the repo and create a branch
2. Make your changes
3. Run `npm test` and `npm run build` to verify
4. Open a PR with a description of what you changed and why

## License

MIT
