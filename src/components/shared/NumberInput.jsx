export default function NumberInput({ label, value, onChange, min, max, step = 1 }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm text-gray-700 min-w-0">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </label>
  );
}
