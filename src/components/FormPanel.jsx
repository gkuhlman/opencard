import { useState } from 'react';
import ThemeSection from './sections/ThemeSection';
import GridSection from './sections/GridSection';
import CellSection from './sections/CellSection';
import PitchersSection from './sections/PitchersSection';
import LayoutSection from './sections/LayoutSection';
import PrintSection from './sections/PrintSection';
import JsonEditor from './JsonEditor';
import PresetPicker from './PresetPicker';

export default function FormPanel({ config, updateConfig, resetConfig, importConfig, exportConfig, getConfigJson, shareConfig, loadPreset, onPrint }) {
  const [mode, setMode] = useState('form'); // 'form' | 'json'
  const [shareToast, setShareToast] = useState(false);

  const handleShare = async () => {
    try {
      await shareConfig();
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    } catch { /* clipboard may fail in insecure contexts */ }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex px-4 pt-2 bg-white shrink-0">
        <button
          type="button"
          onClick={() => setMode('form')}
          className={`px-3 py-1.5 text-sm font-medium border-b-2 ${mode === 'form' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => setMode('json')}
          className={`px-3 py-1.5 text-sm font-medium border-b-2 ${mode === 'json' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          JSON
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-gray-200 bg-white shrink-0">
        <button
          type="button"
          onClick={resetConfig}
          className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={exportConfig}
          className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          Download
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={handleShare}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            Share
          </button>
          {shareToast && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap z-10">
              Copied!
            </div>
          )}
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onPrint}
          className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Print
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'form' ? (
          <div className="p-4">
            <PresetPicker loadPreset={loadPreset} />
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
              configJson={getConfigJson()}
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
            href="https://github.com/gkuhlman/opencard"
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
