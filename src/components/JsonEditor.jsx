import { useState, useEffect } from 'react';

export default function JsonEditor({ overridesJson, onApply }) {
  const [text, setText] = useState(overridesJson);
  const [error, setError] = useState(null);

  useEffect(() => {
    setText(overridesJson);
    setError(null);
  }, [overridesJson]);

  const handleApply = () => {
    try {
      JSON.parse(text);
      setError(null);
      onApply(text);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <textarea
        value={text}
        onChange={e => {
          setText(e.target.value);
          setError(null);
        }}
        spellCheck={false}
        className="flex-1 w-full p-3 text-sm font-mono bg-gray-50 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      <button
        type="button"
        onClick={handleApply}
        className="mt-2 px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 self-end"
      >
        Apply JSON
      </button>
    </div>
  );
}
