import { useState } from 'react';
import FontPicker from 'react-fontpicker-ts';
import 'react-fontpicker-ts/dist/index.css';
import SectionHeader from '../shared/SectionHeader';
import ColorPicker from '../shared/ColorPicker';
import NumberInput from '../shared/NumberInput';
import Toggle from '../shared/Toggle';
import { deriveColors } from '../../engine/colorUtils';

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
