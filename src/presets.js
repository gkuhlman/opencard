import { deriveColors } from './engine/colorUtils';

const presets = [
  {
    name: 'Classic Blue',
    description: 'The default scorecard theme',
    overrides: {},
  },
  {
    name: 'Minimal B&W',
    description: 'Clean black and white for easy printing',
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
    },
  },
  {
    name: 'Retro Green',
    description: 'Vintage field-green scorecard',
    overrides: {
      theme: {
        colors: deriveColors('#2e7d32'),
      },
    },
  },
  {
    name: 'Dark Mode',
    description: 'Easy on the eyes, dark background',
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
