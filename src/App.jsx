import { useCallback } from 'react';
import { useConfig } from './hooks/useConfig';
import { generatePage } from './engine/generate';
import FormPanel from './components/FormPanel';
import Preview from './components/Preview';

export default function App() {
  const { config, overrides, updateConfig, resetConfig, importConfig, exportConfig, getOverridesJson } = useConfig();

  const handlePrint = useCallback(() => {
    const html = generatePage(config);
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    // Wait for fonts to load before triggering print
    win.onload = () => {
      win.focus();
      win.print();
    };
  }, [config]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left panel: form */}
      <div className="w-[380px] shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <FormPanel
          config={config}
          updateConfig={updateConfig}
          resetConfig={resetConfig}
          importConfig={importConfig}
          exportConfig={exportConfig}
          getOverridesJson={getOverridesJson}
          onPrint={handlePrint}
        />
      </div>

      {/* Right panel: preview */}
      <div className="flex-1 min-w-0">
        <Preview config={config} />
      </div>
    </div>
  );
}
