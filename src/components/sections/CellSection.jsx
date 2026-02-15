import SectionHeader from '../shared/SectionHeader';
import Toggle from '../shared/Toggle';
import NumberInput from '../shared/NumberInput';

export default function CellSection({ config, updateConfig }) {
  const { outcomes, diamond, count } = config.cell;

  const updateOutcomeItem = (index, value) => {
    const items = [...outcomes.items];
    items[index] = value;
    updateConfig('cell.outcomes.items', items);
  };

  const addOutcomeItem = () => {
    updateConfig('cell.outcomes.items', [...outcomes.items, '']);
  };

  const removeOutcomeItem = (index) => {
    updateConfig('cell.outcomes.items', outcomes.items.filter((_, i) => i !== index));
  };

  return (
    <SectionHeader title="Cell">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Outcomes</h4>
        <Toggle
          label="Show outcomes"
          checked={outcomes.show}
          onChange={v => updateConfig('cell.outcomes.show', v)}
        />
        {outcomes.show && (
          <div className="mt-2 space-y-1">
            {outcomes.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => updateOutcomeItem(i, e.target.value)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeOutcomeItem(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-1"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOutcomeItem}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              + Add outcome
            </button>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Diamond</h4>
        <div className="space-y-2">
          <Toggle
            label="Show diamond"
            checked={diamond.show}
            onChange={v => updateConfig('cell.diamond.show', v)}
          />
          {diamond.show && (
            <NumberInput
              label="Max size"
              value={diamond.maxSize}
              min={16}
              max={80}
              onChange={v => updateConfig('cell.diamond.maxSize', v)}
            />
          )}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Count Tracker</h4>
        <div className="space-y-2">
          <Toggle
            label="Show count"
            checked={count.show}
            onChange={v => updateConfig('cell.count.show', v)}
          />
          {count.show && (
            <div className="flex gap-4">
              <NumberInput label="Balls" value={count.balls} min={0} max={4} onChange={v => updateConfig('cell.count.balls', v)} />
              <NumberInput label="Strikes" value={count.strikes} min={0} max={3} onChange={v => updateConfig('cell.count.strikes', v)} />
            </div>
          )}
        </div>
      </div>
    </SectionHeader>
  );
}
