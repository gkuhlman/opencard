import presets from '../presets';
import defaults from '../engine/defaults.json';
import { deepMerge } from '../engine/generate';

export default function PresetPicker({ loadPreset }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Presets</h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const merged = deepMerge(defaults, preset.overrides);
          const colors = merged.theme.colors;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => loadPreset(preset.overrides)}
              className="flex items-center gap-2 px-3 py-2 rounded border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex shrink-0 gap-0.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: colors.primary }} />
                <div className="w-3 h-3 rounded-sm" style={{ background: colors.ink }} />
                <div className="w-3 h-3 rounded-sm" style={{ background: colors.background }} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-700 truncate">{preset.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
