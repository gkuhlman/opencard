import { useState } from 'react';
import ThemeSection from './sections/ThemeSection';
import GridSection from './sections/GridSection';
import CellSection from './sections/CellSection';
import PitchersSection from './sections/PitchersSection';
import LayoutSection from './sections/LayoutSection';
import PrintSection from './sections/PrintSection';
import JsonEditor from './JsonEditor';

export default function FormPanel({ config, updateConfig, resetConfig, importConfig, exportConfig, getOverridesJson, onPrint }) {
  const [mode, setMode] = useState('form'); // 'form' | 'json'

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shrink-0">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('form')}
            className={`px-3 py-1 text-sm rounded ${mode === 'form' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setMode('json')}
            className={`px-3 py-1 text-sm rounded ${mode === 'json' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            JSON
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetConfig}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={exportConfig}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Download
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Print
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'form' ? (
          <div className="p-4">
            <LayoutSection config={config} updateConfig={updateConfig} />
            <ThemeSection config={config} updateConfig={updateConfig} />
            <GridSection config={config} updateConfig={updateConfig} />
            <CellSection config={config} updateConfig={updateConfig} />
            <PitchersSection config={config} updateConfig={updateConfig} />
            <PrintSection config={config} updateConfig={updateConfig} />
          </div>
        ) : (
          <div className="p-4 h-full">
            <JsonEditor
              overridesJson={getOverridesJson()}
              onApply={importConfig}
            />
          </div>
        )}
      </div>

      {/* About footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0 text-xs text-gray-500">
        <p>
          Open source baseball scorecard builder.{' '}
          <a
            href="https://github.com/gkuhlman/open-scorecard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
