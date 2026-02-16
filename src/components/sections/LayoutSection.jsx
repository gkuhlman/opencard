import SectionHeader from '../shared/SectionHeader';
import Toggle from '../shared/Toggle';
import NumberInput from '../shared/NumberInput';

const ORIENTATIONS = ['landscape', 'portrait'];

export default function LayoutSection({ config, updateConfig }) {
  const updateHeaderField = (index, field, value) => {
    const fields = [...config.header.fields];
    fields[index] = { ...fields[index], [field]: value };
    updateConfig('header.fields', fields);
  };

  const addHeaderField = () => {
    updateConfig('header.fields', [
      ...config.header.fields,
      { key: '', label: '', width: '15%' },
    ]);
  };

  const removeHeaderField = (index) => {
    updateConfig('header.fields', config.header.fields.filter((_, i) => i !== index));
  };

  return (
    <SectionHeader title="Layout">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">General</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Name</span>
            <input
              type="text"
              value={config.name}
              onChange={e => updateConfig('name', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Orientation</span>
            <select
              value={config.page.orientation}
              onChange={e => updateConfig('page.orientation', e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {ORIENTATIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Header</h4>
        <Toggle
          label="Show header"
          checked={config.header.show}
          onChange={v => updateConfig('header.show', v)}
        />
        {config.header.show && (
          <div className="mt-2 space-y-1">
            {config.header.fields.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={f.label}
                  placeholder="Label"
                  onChange={e => updateHeaderField(i, 'label', e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <input
                  type="text"
                  value={f.width}
                  placeholder="Width"
                  onChange={e => updateHeaderField(i, 'width', e.target.value)}
                  className="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeHeaderField(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-1"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHeaderField}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              + Add field
            </button>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Scoreboard</h4>
        <Toggle
          label="Show scoreboard"
          checked={config.scoreboard.show}
          onChange={v => updateConfig('scoreboard.show', v)}
        />
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h4>
        <div className="space-y-2">
          <Toggle
            label="Show notes"
            checked={config.notes.show}
            onChange={v => updateConfig('notes.show', v)}
          />
          {config.notes.show && (
            <NumberInput
              label="Lines"
              value={config.notes.lines}
              min={1}
              max={15}
              onChange={v => updateConfig('notes.lines', v)}
            />
          )}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Section Labels</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700 shrink-0">Away</span>
            <input
              type="text"
              value={config.sections.away.label}
              onChange={e => updateConfig('sections.away.label', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700 shrink-0">Home</span>
            <input
              type="text"
              value={config.sections.home.label}
              onChange={e => updateConfig('sections.home.label', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
        </div>
      </div>
    </SectionHeader>
  );
}
