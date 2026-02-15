import { useState, useCallback, useMemo } from 'react';
import defaults from '../engine/defaults.json';
import { deepMerge } from '../engine/generate';

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function setByPath(obj, path, value) {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

// Compute minimal overrides: only fields that differ from defaults
function computeOverrides(config, defaults) {
  if (config === defaults) return undefined;
  if (Array.isArray(config)) {
    if (JSON.stringify(config) === JSON.stringify(defaults)) return undefined;
    return config;
  }
  if (config && typeof config === 'object' && defaults && typeof defaults === 'object') {
    const result = {};
    let hasKeys = false;
    for (const key of Object.keys(config)) {
      const sub = computeOverrides(config[key], defaults[key]);
      if (sub !== undefined) {
        result[key] = sub;
        hasKeys = true;
      }
    }
    return hasKeys ? result : undefined;
  }
  if (config !== defaults) return config;
  return undefined;
}

export function useConfig() {
  const [overrides, setOverrides] = useState({});

  const config = useMemo(() => deepMerge(defaults, overrides), [overrides]);

  const updateConfig = useCallback((path, value) => {
    setOverrides(prev => {
      const merged = deepMerge(defaults, prev);
      const updated = setByPath(merged, path, value);
      return computeOverrides(updated, defaults) || {};
    });
  }, []);

  const resetConfig = useCallback(() => {
    setOverrides({});
  }, []);

  const importConfig = useCallback((jsonString) => {
    const parsed = JSON.parse(jsonString);
    setOverrides(parsed);
  }, []);

  const exportConfig = useCallback(() => {
    const json = JSON.stringify(overrides, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scorecard.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [overrides]);

  const getOverridesJson = useCallback(() => {
    return JSON.stringify(overrides, null, 2);
  }, [overrides]);

  return {
    config,
    overrides,
    updateConfig,
    resetConfig,
    importConfig,
    exportConfig,
    getOverridesJson,
  };
}
