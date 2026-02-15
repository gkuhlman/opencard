import SectionHeader from '../shared/SectionHeader';
import NumberInput from '../shared/NumberInput';

export default function PitchersSection({ config, updateConfig }) {
  const { rows, stats } = config.pitchers;

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateConfig('pitchers.stats', newStats);
  };

  const addStat = () => {
    updateConfig('pitchers.stats', [...stats, { key: '', label: '' }]);
  };

  const removeStat = (index) => {
    updateConfig('pitchers.stats', stats.filter((_, i) => i !== index));
  };

  return (
    <SectionHeader title="Pitchers">
      <NumberInput label="Rows" value={rows} min={1} max={15} onChange={v => updateConfig('pitchers.rows', v)} />
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stat Columns</h4>
        <div className="space-y-1">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={stat.label}
                placeholder="Label"
                onChange={e => updateStat(i, 'label', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                type="text"
                value={stat.key}
                placeholder="Key"
                onChange={e => updateStat(i, 'key', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="text-red-400 hover:text-red-600 text-sm px-1"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStat}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            + Add stat
          </button>
        </div>
      </div>
    </SectionHeader>
  );
}
