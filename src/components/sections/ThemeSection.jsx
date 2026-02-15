import SectionHeader from '../shared/SectionHeader';
import ColorPicker from '../shared/ColorPicker';
import NumberInput from '../shared/NumberInput';

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
  return (
    <SectionHeader title="Theme">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Colors</h4>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_FIELDS.map(f => (
            <ColorPicker
              key={f.key}
              label={f.label}
              value={config.theme.colors[f.key]}
              onChange={v => updateConfig(`theme.colors.${f.key}`, v)}
            />
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fonts</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Display</span>
            <input
              type="text"
              value={config.theme.fonts.display}
              onChange={e => updateConfig('theme.fonts.display', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Body</span>
            <input
              type="text"
              value={config.theme.fonts.body}
              onChange={e => updateConfig('theme.fonts.body', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
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
