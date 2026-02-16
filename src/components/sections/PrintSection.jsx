import SectionHeader from '../shared/SectionHeader';
import Toggle from '../shared/Toggle';
import NumberInput from '../shared/NumberInput';

const PAGE_SIZES = [
  { value: 'LETTER', label: 'Letter (8.5 x 11)' },
  { value: 'A4', label: 'A4 (8.27 x 11.69)' },
  { value: 'LEGAL', label: 'Legal (8.5 x 14)' },
  { value: 'TABLOID', label: 'Tabloid (11 x 17)' },
  { value: 'HALF_LETTER', label: 'Half Letter (5.5 x 8.5)' },
  { value: 'A5', label: 'A5 (5.83 x 8.27)' },
  { value: '5X7', label: '5 x 7' },
  { value: '4X6', label: '4 x 6' },
];
export default function PrintSection({ config, updateConfig }) {
  return (
    <SectionHeader title="Print" defaultOpen={false}>
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Page Size</span>
          <select
            value={config.page.size}
            onChange={e => updateConfig('page.size', e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {PAGE_SIZES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Margins (px)</h4>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Top" value={config.page.margins.top} min={0} max={96} onChange={v => updateConfig('page.margins.top', v)} />
            <NumberInput label="Right" value={config.page.margins.right} min={0} max={96} onChange={v => updateConfig('page.margins.right', v)} />
            <NumberInput label="Bottom" value={config.page.margins.bottom} min={0} max={96} onChange={v => updateConfig('page.margins.bottom', v)} />
            <NumberInput label="Left" value={config.page.margins.left} min={0} max={96} onChange={v => updateConfig('page.margins.left', v)} />
          </div>
        </div>
        <Toggle
          label="Fit to page"
          checked={config.print.fitToPage}
          onChange={v => updateConfig('print.fitToPage', v)}
        />
      </div>
    </SectionHeader>
  );
}
