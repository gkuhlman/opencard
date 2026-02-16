import { useCallback, useState } from 'react';
import { useConfig } from './hooks/useConfig';
import { generatePage } from './engine/generate';
import FormPanel from './components/FormPanel';
import Preview from './components/Preview';

export default function App() {
  const { config, updateConfig, resetConfig, importConfig, exportConfig, getConfigJson, shareConfig, loadPreset } = useConfig();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handlePrint = useCallback(() => {
    const html = generatePage(config);
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  }, [config]);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Desktop: static sidebar */}
      <div className="hidden md:flex w-[380px] shrink-0 bg-white border-r border-gray-200 flex-col">
        <FormPanel
          config={config}
          updateConfig={updateConfig}
          resetConfig={resetConfig}
          importConfig={importConfig}
          exportConfig={exportConfig}
          getConfigJson={getConfigJson}
          shareConfig={shareConfig}
          loadPreset={loadPreset}
          onPrint={handlePrint}
        />
      </div>

      {/* Mobile: floating edit button */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-40 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:bg-blue-700"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {/* Mobile: drawer overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile: slide-out drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[380px] bg-white shadow-xl flex flex-col transform transition-transform duration-200 ease-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 shrink-0">
          <span className="text-sm font-semibold text-gray-700">Edit Scorecard</span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <FormPanel
            config={config}
            updateConfig={updateConfig}
            resetConfig={resetConfig}
            importConfig={importConfig}
            exportConfig={exportConfig}
            getConfigJson={getConfigJson}
            shareConfig={shareConfig}
            loadPreset={loadPreset}
            onPrint={handlePrint}
          />
        </div>
      </div>

      {/* Preview: always full width on mobile, takes remaining space on desktop */}
      <div className="flex-1 min-w-0">
        <Preview config={config} />
      </div>
    </div>
  );
}
