import SectionHeader from '../shared/SectionHeader';
import Toggle from '../shared/Toggle';
import NumberInput from '../shared/NumberInput';

const PAGE_SIZES = ['LETTER', 'A4', 'LEGAL', 'TABLOID'];
const ORIENTATIONS = ['landscape', 'portrait'];

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
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
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
