import { deriveColors } from './engine/colorUtils';

const presets = [
  {
    name: 'Standard',
    description: 'Full scorecard, letter landscape',
    overrides: {},
  },
  {
    name: 'Compact',
    description: 'Half-letter, tighter layout',
    overrides: {
      page: { size: 'HALF_LETTER', orientation: 'landscape' },
      grid: { rows: 9, innings: 9 },
      theme: {
        sizing: {
          inningCellWidth: 52,
          rowHeight: 54,
          playerColWidth: 90,
          posColWidth: 24,
          statColWidth: 20,
        },
      },
      cell: {
        diamond: { maxSize: 34 },
      },
      pitchers: { rows: 4 },
      notes: { lines: 3 },
    },
  },
  {
    name: 'Minimalist',
    description: 'Clean B&W, just the diamond',
    overrides: {
      theme: {
        colors: {
          primary: '#444444',
          primaryLight: '#d0d0d0',
          primaryMuted: '#e4e4e4',
          primaryFaint: '#f3f3f3',
          ink: '#1a1a1a',
          background: '#ffffff',
          pageBackground: '#e0e0e0',
          border: '#bbbbbb',
          borderLight: '#d8d8d8',
          diamondFill: '#f0f0f0',
          diamondStroke: '#bbbbbb',
        },
      },
      cell: {
        outcomes: { show: false },
        count: { show: false },
      },
      grid: {
        statColumns: [
          { key: 'R', label: 'R' },
          { key: 'H', label: 'H' },
        ],
      },
      notes: { show: false },
    },
  },
  {
    name: 'Pocket',
    description: '5x7 card, bare essentials',
    overrides: {
      page: { size: '5X7', orientation: 'landscape' },
      grid: { rows: 9, innings: 9, statColumns: [{ key: 'R', label: 'R' }, { key: 'H', label: 'H' }] },
      theme: {
        sizing: {
          inningCellWidth: 44,
          rowHeight: 44,
          playerColWidth: 72,
          posColWidth: 20,
          statColWidth: 18,
        },
      },
      cell: {
        outcomes: { show: false },
        diamond: { maxSize: 28 },
        count: { show: false },
      },
      header: { show: false },
      pitchers: { rows: 3 },
      notes: { show: false },
      scoreboard: { show: false },
    },
  },
  {
    name: 'Retro Green',
    description: 'Vintage field-green theme',
    overrides: {
      theme: {
        colors: deriveColors('#2e7d32'),
      },
    },
  },
  {
    name: 'Dark Mode',
    description: 'Dark background, easy on the eyes',
    overrides: {
      theme: {
        colors: {
          primary: '#60a5fa',
          primaryLight: '#1e3a5f',
          primaryMuted: '#172d4a',
          primaryFaint: '#111f33',
          ink: '#e2e8f0',
          background: '#0f172a',
          pageBackground: '#020617',
          border: '#334155',
          borderLight: '#1e293b',
          diamondFill: '#1e293b',
          diamondStroke: '#475569',
        },
      },
    },
  },
];

export default presets;
