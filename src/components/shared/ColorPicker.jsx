export default function ColorPicker({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
