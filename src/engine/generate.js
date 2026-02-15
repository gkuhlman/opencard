// Ported from scorecard engine's scripts/generate.js
// Pure functions only — no Node.js APIs, converted to ES modules

export function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFontsUrl(fonts) {
  const families = [];
  if (fonts.display) {
    families.push(
      `family=${fonts.display.replace(/ /g, "+")}:wght@400;500;600;700`,
    );
  }
  if (fonts.body && fonts.body !== fonts.display) {
    families.push(`family=${fonts.body.replace(/ /g, "+")}:wght@400;500;600`);
  }
  if (families.length === 0) return "";
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

function generateCssVars(config) {
  const c = config.theme.colors;
  const f = config.theme.fonts;
  const s = config.theme.sizing;
  return `
      --primary: ${c.primary};
      --primary-light: ${c.primaryLight};
      --primary-muted: ${c.primaryMuted || c.primaryLight};
      --primary-faint: ${c.primaryFaint};
      --ink: ${c.ink};
      --background: ${c.background};
      --page-bg: ${c.pageBackground};
      --border: ${c.border};
      --border-light: ${c.borderLight};
      --diamond-fill: ${c.diamondFill};
      --diamond-stroke: ${c.diamondStroke || c.border};
      --font-display: '${f.display}', sans-serif;
      --font-body: '${f.body}', sans-serif;
      --cell-size: ${s.inningCellWidth}px;
      --row-height: ${s.rowHeight}px;
      --player-col: ${s.playerColWidth}px;
      --pos-col: ${s.posColWidth}px;
      --stat-col: ${s.statColWidth}px;
      --diamond-max: ${config.cell.diamond.maxSize}px;`;
}

function generateAtBatCell(config) {
  const cell = config.cell;
  let html = '<div class="at-bat-cell">';

  if (cell.outcomes.show) {
    html += '<div class="outcome-labels">';
    for (const item of cell.outcomes.items) {
      html += `<span>${escapeHtml(item)}</span>`;
    }
    html += "</div>";
  }

  if (cell.diamond.show) {
    html += `<div class="diamond-wrap">
        <svg viewBox="0 0 20 20">
          <rect x="3" y="3" width="14" height="14" rx="1"
                transform="rotate(45 10 10)" />
        </svg>
      </div>`;
  }

  if (cell.count.show) {
    html += '<div class="count-tracker">';
    html += '<div class="count-group"><span class="count-label">S</span>';
    for (let i = 0; i < cell.count.strikes; i++) {
      html += '<div class="count-box"></div>';
    }
    html += "</div>";
    html += '<div class="count-group"><span class="count-label">B</span>';
    for (let i = 0; i < cell.count.balls; i++) {
      html += '<div class="count-box"></div>';
    }
    html += "</div>";
    html += "</div>";
  }

  html += "</div>";
  return html;
}

function generateHeader(config) {
  if (!config.header.show) return "";
  const fields = config.header.fields;
  let html = '<div class="game-header">';
  for (const field of fields) {
    html += `<div class="header-field" style="width:${field.width}">
        <label>${escapeHtml(field.label)}</label>
        <div class="header-input"></div>
      </div>`;
  }
  html += "</div>";
  return html;
}

function generateBattingGrid(config, tbodyId) {
  const { rows, innings, statColumns } = config.grid;
  const atBatHtml = generateAtBatCell(config);

  let html = '<div class="grid-wrap"><table class="scoring-grid"><thead><tr>';
  html += '<th class="col-player">Player</th>';
  html += '<th class="col-pos">Pos</th>';
  for (let i = 1; i <= innings; i++) {
    html += `<th class="col-inning">${i}</th>`;
  }
  for (const col of statColumns) {
    html += `<th class="col-stat">${escapeHtml(col.label)}</th>`;
  }
  html += "</tr></thead><tbody>";

  for (let r = 0; r < rows; r++) {
    html += "<tr>";
    html += '<td class="cell-player"></td>';
    html += '<td class="cell-pos"></td>';
    for (let i = 0; i < innings; i++) {
      html += `<td class="cell-inning">${atBatHtml}</td>`;
    }
    for (let s = 0; s < statColumns.length; s++) {
      html += '<td class="cell-stat"></td>';
    }
    html += "</tr>";
  }

  html += "</tbody></table></div>";
  return html;
}

function generatePitcherLog(config) {
  const { rows, stats } = config.pitchers;
  let html = '<div class="sidebar-block">';
  html += '<div class="sidebar-title">Pitcher</div>';
  html += '<table class="pitcher-table"><thead><tr>';
  html += "<th>Name</th>";
  for (const stat of stats) {
    html += `<th>${escapeHtml(stat.label)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (let i = 0; i < rows; i++) {
    html += "<tr><td></td>";
    for (let s = 0; s < stats.length; s++) {
      html += "<td></td>";
    }
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  return html;
}

function generateNotes(config) {
  if (!config.notes.show) return "";
  const lines = config.notes.lines;
  let html = '<div class="sidebar-block">';
  html += '<div class="sidebar-title">Game Notes</div>';
  html += '<div class="game-notes-area"><div class="game-notes-lines">';
  for (let i = 0; i < lines; i++) {
    html += '<div class="note-line"></div>';
  }
  html += "</div></div></div>";
  return html;
}

function generateScoreboard(config) {
  if (!config.scoreboard.show) return "";
  const innings = config.grid.innings;
  const totals = config.scoreboard.totals;

  let html = '<div class="scoreboard-block">';
  html += `<div class="scoreboard-header">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2 C12 2 14 8 18 12 C14 16 12 22 12 22"/>
        <path d="M12 2 C12 2 10 8 6 12 C10 16 12 22 12 22"/>
      </svg>
      Scoreboard
    </div>`;

  html += '<table class="scoreboard-table"><thead><tr><th>Team</th>';
  for (let i = 1; i <= innings; i++) {
    html += `<th>${i}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (let t = 0; t < 2; t++) {
    html += "<tr><td></td>";
    for (let i = 0; i < innings; i++) {
      html += "<td></td>";
    }
    html += "</tr>";
  }
  html += "</tbody></table>";

  html +=
    '<table class="scoreboard-table"><thead class="scoreboard-totals"><tr><th></th>';
  for (const t of totals) {
    html += `<th>${escapeHtml(t)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (let t = 0; t < 2; t++) {
    html += "<tr><td></td>";
    for (let i = 0; i < totals.length; i++) {
      html += "<td></td>";
    }
    html += "</tr>";
  }
  html += "</tbody></table>";

  html += "</div>";
  return html;
}

function generateHalfInning(config, side) {
  const sectionConfig = config.sections[side];
  const label = sectionConfig.label;
  const footerItems = sectionConfig.footer;

  const labelParts = label.split(" / ");
  let labelHtml;
  if (labelParts.length === 2) {
    labelHtml = `${escapeHtml(labelParts[0])} <span>/</span> ${escapeHtml(labelParts[1])}`;
  } else {
    labelHtml = escapeHtml(label);
  }

  let html = '<div class="half-inning">';
  html += `<div class="section-header">${labelHtml}</div>`;
  html += '<div class="section-divider"></div>';
  html += '<div class="section-body">';

  html += generateBattingGrid(config, `${side}-batting`);

  html += '<div class="section-footer">';
  for (const item of footerItems) {
    if (item === "pitchers") {
      html += generatePitcherLog(config);
    } else if (item === "notes") {
      html += generateNotes(config);
    } else if (item === "scoreboard") {
      html += generateScoreboard(config);
    }
  }
  html += "</div>";

  html += "</div></div>";
  return html;
}

const PAGE_SIZES = {
  LETTER: [8.5, 11],
  A4: [8.27, 11.69],
  LEGAL: [8.5, 14],
  TABLOID: [11, 17],
};

function resolvePageSize(page) {
  const orientation = page.orientation || 'landscape';
  let widthIn, heightIn, cssSize;

  if (Array.isArray(page.size)) {
    widthIn = page.size[0];
    heightIn = page.size[1];
    cssSize = `${widthIn}in ${heightIn}in`;
  } else {
    const name = (page.size || 'LETTER').toUpperCase();
    const dims = PAGE_SIZES[name] || PAGE_SIZES.LETTER;
    if (orientation === 'landscape') {
      widthIn = Math.max(dims[0], dims[1]);
      heightIn = Math.min(dims[0], dims[1]);
    } else {
      widthIn = Math.min(dims[0], dims[1]);
      heightIn = Math.max(dims[0], dims[1]);
    }
    cssSize = `${widthIn}in ${heightIn}in`;
  }

  const mt = (page.margins && page.margins.top != null) ? page.margins.top / 96 : 0.3;
  const mr = (page.margins && page.margins.right != null) ? page.margins.right / 96 : 0.3;
  const mb = (page.margins && page.margins.bottom != null) ? page.margins.bottom / 96 : 0.3;
  const ml = (page.margins && page.margins.left != null) ? page.margins.left / 96 : 0.3;

  const availW = (widthIn - ml - mr) * 96;
  const availH = (heightIn - mt - mb) * 96;

  return { widthIn, heightIn, availW, availH, cssSize };
}

function calculatePrintZoom(config) {
  const s = config.theme.sizing;
  const g = config.grid;
  const p = config.pitchers;
  const n = config.notes;

  let maxPageH = 0;

  for (const side of ['away', 'home']) {
    let height = 0;

    height += 32;

    if (config.header.show) height += 56;

    height += 26;
    height += 28;
    height += g.rows * s.rowHeight;
    height += 10;

    const footerItems = config.sections[side].footer;
    let maxFooterH = 0;
    for (const item of footerItems) {
      let itemH = 0;
      if (item === 'pitchers') itemH = 28 + 24 + p.rows * 26;
      if (item === 'notes' && n.show) itemH = 28 + 16 + n.lines * 22;
      if (item === 'scoreboard' && config.scoreboard.show) itemH = 170;
      maxFooterH = Math.max(maxFooterH, itemH);
    }
    height += maxFooterH;

    height += 20;

    maxPageH = Math.max(maxPageH, height);
  }

  const width = s.playerColWidth + s.posColWidth
    + g.innings * s.inningCellWidth
    + g.statColumns.length * s.statColWidth
    + 40;

  const { availW, availH } = resolvePageSize(config.page);

  const zoomW = availW / width;
  const zoomH = availH / maxPageH;

  let zoom = Math.min(zoomW, zoomH);
  zoom = Math.min(zoom, 1);
  zoom = Math.floor(zoom * 100) / 100;

  return zoom;
}

export function generatePage(config) {
  const fontsUrl = buildFontsUrl(config.theme.fonts);
  const cssVars = generateCssVars(config);
  const fitToPage = config.print && config.print.fitToPage;
  const printZoom = fitToPage ? calculatePrintZoom(config) : null;
  const pageInfo = resolvePageSize(config.page);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.name)} — Baseball Scorecard</title>
  ${
    fontsUrl
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="${fontsUrl}" rel="stylesheet">`
      : ""
  }
  <style>
    :root {${cssVars}
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body);
      background: var(--page-bg);
      color: var(--ink);
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .scorecard {
      background: var(--background);
      width: fit-content;
      max-width: 100%;
      padding: 28px 32px;
      border-radius: 6px;
      box-shadow:
        0 2px 12px rgba(0,0,0,0.08),
        0 8px 40px rgba(0,0,0,0.06);
    }

    .game-header {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--primary);
    }

    .header-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .header-field label {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--primary);
    }

    .header-field .header-input {
      height: 24px;
      border-bottom: 1.5px solid var(--border);
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--ink);
    }

    .half-inning {
      margin-bottom: 24px;
    }

    .half-inning:last-of-type {
      margin-bottom: 0;
    }

    .section-header {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 6px;
      display: flex;
      gap: 6px;
    }

    .section-header span {
      font-weight: 400;
      color: var(--primary-light);
    }

    .section-divider {
      height: 2px;
      background: var(--primary);
      margin-bottom: 0;
      border-radius: 1px;
    }

    .section-body {
      display: flex;
      flex-direction: column;
    }

    .section-footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 10px;
    }

    .scoring-grid {
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
    }

    .scoring-grid th {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 11px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--primary);
      padding: 6px 2px;
      text-align: center;
      border-bottom: 2px solid var(--primary);
    }

    .scoring-grid th.col-player {
      text-align: left;
      width: var(--player-col);
      padding-left: 4px;
    }

    .scoring-grid th.col-pos {
      width: var(--pos-col);
    }

    .scoring-grid th.col-inning {
      width: var(--cell-size);
    }

    .scoring-grid th.col-stat {
      width: var(--stat-col);
      background: var(--primary-faint);
      border-bottom-color: var(--primary);
    }

    .scoring-grid td {
      height: var(--row-height);
      border-bottom: 1px solid var(--border-light);
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      vertical-align: middle;
    }

    .scoring-grid tr:last-child td {
      border-bottom: 2px solid var(--primary);
    }

    .scoring-grid td.cell-player {
      text-align: left;
      padding-left: 4px;
      font-weight: 500;
      font-size: 12px;
      color: var(--ink);
      border-right: 1px solid var(--border-light);
    }

    .scoring-grid td.cell-pos {
      font-family: var(--font-display);
      font-size: 12px;
      color: var(--primary);
      border-right: 1px solid var(--border);
    }

    .scoring-grid td.cell-inning {
      border-right: 1px solid var(--border-light);
      padding: 0;
      position: relative;
    }

    .scoring-grid td.cell-inning:last-of-type {
      border-right: 1px solid var(--border);
    }

    .scoring-grid td.cell-stat {
      background: var(--primary-faint);
      border-right: 1px solid var(--border-light);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 13px;
      color: var(--ink);
    }

    .scoring-grid td.cell-stat:last-child {
      border-right: none;
    }

    .at-bat-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
      padding: 2px 0 2px;
    }

    .outcome-labels {
      display: flex;
      gap: 1px;
      justify-content: center;
      flex-shrink: 0;
      line-height: 1;
    }

    .outcome-labels span {
      font-family: var(--font-display);
      font-size: 7px;
      font-weight: 600;
      letter-spacing: 0;
      color: var(--primary-light);
      text-align: center;
      padding: 0 1px;
      line-height: 1;
    }

    .diamond-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      width: 100%;
    }

    .diamond-wrap svg {
      width: 100%;
      height: 100%;
      max-width: var(--diamond-max);
      max-height: var(--diamond-max);
    }

    .diamond-wrap svg rect {
      fill: var(--diamond-fill);
      stroke: var(--diamond-stroke);
      stroke-width: 1.2;
    }

    .count-tracker {
      position: absolute;
      bottom: 1px;
      right: 1px;
      display: flex;
      align-items: flex-end;
      gap: 0;
      line-height: 1;
    }

    .count-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }

    .count-group .count-label {
      font-family: var(--font-display);
      font-size: 5.5px;
      font-weight: 700;
      color: var(--primary-light);
      line-height: 1;
      margin-bottom: 0px;
    }

    .count-box {
      width: 7px;
      height: 7px;
      border: 1px solid var(--border);
      background: var(--background);
    }

    .count-box + .count-box {
      margin-top: -1px;
    }

    .count-group + .count-group .count-box {
      margin-left: -1px;
    }

    .sidebar-block {
      border: 1.5px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
    }

    .sidebar-title {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--background);
      background: var(--primary);
      padding: 5px 10px;
    }

    .pitcher-table {
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
    }

    .pitcher-table th {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 10px;
      letter-spacing: 0.5px;
      color: var(--primary);
      padding: 4px 2px;
      text-align: center;
      border-bottom: 1px solid var(--border-light);
      background: var(--primary-faint);
    }

    .pitcher-table th:first-child {
      width: 40%;
      text-align: left;
      padding-left: 8px;
    }

    .pitcher-table td {
      height: 26px;
      border-bottom: 1px solid var(--border-light);
      text-align: center;
      font-size: 12px;
      font-weight: 500;
    }

    .pitcher-table td:first-child {
      text-align: left;
      padding-left: 8px;
      border-right: 1px solid var(--border-light);
    }

    .pitcher-table td:not(:first-child) {
      border-right: 1px solid var(--border-light);
    }

    .pitcher-table td:last-child {
      border-right: none;
    }

    .pitcher-table tr:last-child td {
      border-bottom: none;
    }

    .game-notes-area {
      padding: 8px 10px;
      min-height: 80px;
    }

    .game-notes-lines {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .note-line {
      height: 22px;
      border-bottom: 1px solid var(--border-light);
    }

    .note-line:last-child {
      border-bottom: none;
    }

    .scoreboard-block {
      border: 2px solid var(--primary);
      border-radius: 6px;
      overflow: hidden;
    }

    .scoreboard-header {
      background: var(--primary);
      color: var(--background);
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .scoreboard-header .icon {
      width: 18px;
      height: 18px;
      opacity: 0.8;
    }

    .scoreboard-table {
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
    }

    .scoreboard-table th,
    .scoreboard-table td {
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      padding: 4px 1px;
      border: 1px solid var(--border-light);
      color: var(--primary);
    }

    .scoreboard-table th {
      background: var(--primary-faint);
      font-size: 10px;
      letter-spacing: 0.5px;
    }

    .scoreboard-table th:first-child,
    .scoreboard-table td:first-child {
      text-align: left;
      padding-left: 8px;
      width: 50px;
      font-weight: 700;
    }

    .scoreboard-table td {
      height: 22px;
      color: var(--ink);
      font-weight: 500;
    }

    .scoreboard-totals th {
      background: var(--primary);
      color: var(--background);
      font-weight: 700;
    }

    .card-footer {
      margin-top: 12px;
      text-align: right;
      font-family: var(--font-display);
      font-size: 9px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--primary-light);
    }

    .print-page:not(:first-child) .game-header,
    .print-page:not(:last-child) .card-footer {
      display: none;
    }

    @page {
      size: ${pageInfo.cssSize};
      margin: 0.3in;
    }

    @media print {
      body {
        background: white;
        padding: 0;
        margin: 0;${printZoom ? `
        zoom: ${printZoom};` : ''}
      }

      .scorecard {
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        padding: 16px;
      }

      .print-page:not(:first-child) .game-header,
      .print-page:not(:last-child) .card-footer {
        display: block;
      }

      .print-page:not(:first-child) .game-header {
        display: flex;
      }

      .print-page {
        page-break-after: always;
        page-break-inside: avoid;
      }

      .print-page:last-child {
        page-break-after: auto;
      }

      .half-inning {
        margin-bottom: 0;
      }

      .game-header {
        margin-bottom: 12px;
        padding-bottom: 10px;
      }

      .section-footer {
        margin-top: 6px;
        gap: 10px;
      }

      .card-footer {
        margin-top: 8px;
      }

      .diamond-wrap svg rect {
        fill: white;
        stroke: #888;
      }
    }
  </style>
</head>
<body>

<div class="scorecard">
  <div class="print-page">
${config.header.show ? generateHeader(config) : ""}
${generateHalfInning(config, "away")}
    <div class="card-footer">
      ${escapeHtml(config.name)}
    </div>
  </div>
  <div class="print-page">
${config.header.show ? generateHeader(config) : ""}
${generateHalfInning(config, "home")}
    <div class="card-footer">
      ${escapeHtml(config.name)}
    </div>
  </div>
</div>

</body>
</html>`;
}
