import SectionHeader from '../shared/SectionHeader';
import NumberInput from '../shared/NumberInput';
import Toggle from '../shared/Toggle';

export default function GridSection({ config, updateConfig }) {
  const { rows, innings, statColumns } = config.grid;

  const updateStatCol = (index, field, value) => {
    const cols = [...statColumns];
    cols[index] = { ...cols[index], [field]: value };
    updateConfig('grid.statColumns', cols);
  };

  const addStatCol = () => {
    updateConfig('grid.statColumns', [...statColumns, { key: '', label: '' }]);
  };

  const removeStatCol = (index) => {
    updateConfig('grid.statColumns', statColumns.filter((_, i) => i !== index));
  };

  return (
    <SectionHeader title="Grid">
      <div className="flex gap-4">
        <NumberInput label="Rows" value={rows} min={1} max={20} onChange={v => updateConfig('grid.rows', v)} />
        <NumberInput label="Innings" value={innings} min={1} max={20} onChange={v => updateConfig('grid.innings', v)} />
      </div>
      <Toggle label="Substitution line" checked={config.grid.substitutionLine} onChange={v => updateConfig('grid.substitutionLine', v)} />
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stat Columns</h4>
        <div className="space-y-1">
          {statColumns.map((col, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={col.label}
                placeholder="Label"
                onChange={e => updateStatCol(i, 'label', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                type="text"
                value={col.key}
                placeholder="Key"
                onChange={e => updateStatCol(i, 'key', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeStatCol(i)}
                className="text-red-400 hover:text-red-600 text-sm px-1"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStatCol}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            + Add column
          </button>
        </div>
      </div>
    </SectionHeader>
  );
}
