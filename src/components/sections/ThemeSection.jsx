import { useState } from 'react';
import FontPicker from 'react-fontpicker-ts';
import 'react-fontpicker-ts/dist/index.css';
import SectionHeader from '../shared/SectionHeader';
import ColorPicker from '../shared/ColorPicker';
import NumberInput from '../shared/NumberInput';
import Toggle from '../shared/Toggle';
import { deriveColors } from '../../engine/colorUtils';

const COLOR_PALETTES = [
  { name: 'Classic Blue', colors: null }, // null = use deriveColors
  { name: 'Navy', primary: '#1e3a5f' },
  { name: 'Red', primary: '#c0392b' },
  { name: 'Green', primary: '#2e7d32' },
  { name: 'Purple', primary: '#6b3fa0' },
  { name: 'Orange', primary: '#d35400' },
  { name: 'Slate', primary: '#475569' },
  {
    name: 'Dark',
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
];

const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary' },
  { key: 'primaryLight', label: 'Primary Light' },
  { key: 'primaryMuted', label: 'Primary Muted' },
  { key: 'primaryFaint', label: 'Primary Faint' },
  { key: 'ink', label: 'Ink (text)' },
  { key: 'background', label: 'Background' },
  { key: 'pageBackground', label: 'Page Background' },
  { key: 'border', label: 'Border' },
  { key: 'borderLight', label: 'Border Light' },
  { key: 'diamondFill', label: 'Diamond Fill' },
  { key: 'diamondStroke', label: 'Diamond Stroke' },
];

const SIZING_FIELDS = [
  { key: 'inningCellWidth', label: 'Cell Width', min: 30, max: 120 },
  { key: 'rowHeight', label: 'Row Height', min: 30, max: 120 },
  { key: 'playerColWidth', label: 'Player Col', min: 60, max: 200 },
  { key: 'posColWidth', label: 'Pos Col', min: 16, max: 60 },
  { key: 'statColWidth', label: 'Stat Col', min: 16, max: 60 },
];

export default function ThemeSection({ config, updateConfig }) {
  const [autoColors, setAutoColors] = useState(false);

  const handleAutoToggle = (enabled) => {
    setAutoColors(enabled);
    if (enabled) {
      const derived = deriveColors(config.theme.colors.primary);
      // Keep current pageBackground since it's independent
      derived.pageBackground = config.theme.colors.pageBackground;
      for (const [key, value] of Object.entries(derived)) {
        updateConfig(`theme.colors.${key}`, value);
      }
    }
  };

  const applyPalette = (palette) => {
    const colors = palette.colors || deriveColors(palette.primary);
    const pageBackground = palette.colors?.pageBackground || config.theme.colors.pageBackground;
    for (const [key, value] of Object.entries({ ...colors, pageBackground })) {
      updateConfig(`theme.colors.${key}`, value);
    }
  };

  const handlePrimaryChange = (hex) => {
    if (autoColors) {
      const derived = deriveColors(hex);
      derived.pageBackground = config.theme.colors.pageBackground;
      for (const [key, value] of Object.entries(derived)) {
        updateConfig(`theme.colors.${key}`, value);
      }
    } else {
      updateConfig('theme.colors.primary', hex);
    }
  };

  return (
    <SectionHeader title="Theme">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Colors</h4>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {COLOR_PALETTES.map((p) => {
            const bg = p.colors?.primary || p.primary || '#3a9bd5';
            const isDark = p.name === 'Dark';
            return (
              <button
                key={p.name}
                type="button"
                title={p.name}
                onClick={() => applyPalette(p)}
                className="w-7 h-7 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors shrink-0"
                style={{ background: isDark ? 'linear-gradient(135deg, #0f172a 50%, #60a5fa 50%)' : bg }}
              />
            );
          })}
        </div>
        <div className="mb-3">
          <Toggle
            label="Auto-derive from primary"
            checked={autoColors}
            onChange={handleAutoToggle}
          />
        </div>
        {autoColors ? (
          <div className="grid grid-cols-2 gap-2">
            <ColorPicker
              label="Primary"
              value={config.theme.colors.primary}
              onChange={handlePrimaryChange}
            />
            <ColorPicker
              label="Page Background"
              value={config.theme.colors.pageBackground}
              onChange={v => updateConfig('theme.colors.pageBackground', v)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {COLOR_FIELDS.map(f => (
              <ColorPicker
                key={f.key}
                label={f.label}
                value={config.theme.colors[f.key]}
                onChange={f.key === 'primary' ? handlePrimaryChange : v => updateConfig(`theme.colors.${f.key}`, v)}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fonts</h4>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-700 block mb-1">Display</span>
            <FontPicker
              defaultValue={config.theme.fonts.display}
              value={(font) => updateConfig('theme.fonts.display', font)}
              autoLoad
            />
          </div>
          <div>
            <span className="text-sm text-gray-700 block mb-1">Body</span>
            <FontPicker
              defaultValue={config.theme.fonts.body}
              value={(font) => updateConfig('theme.fonts.body', font)}
              autoLoad
            />
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sizing (px)</h4>
        <div className="grid grid-cols-2 gap-2">
          {SIZING_FIELDS.map(f => (
            <NumberInput
              key={f.key}
              label={f.label}
              value={config.theme.sizing[f.key]}
              min={f.min}
              max={f.max}
              onChange={v => updateConfig(`theme.sizing.${f.key}`, v)}
            />
          ))}
        </div>
      </div>
    </SectionHeader>
  );
}
