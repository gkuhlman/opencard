import { useState, useCallback, useMemo, useEffect } from 'react';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import defaults from '../engine/defaults.json';
import { deepMerge } from '../engine/generate';
import { setByPath, computeOverrides } from '../engine/configUtils';

const STORAGE_KEY = 'scorecard-overrides';

function decodeOverrides(hash) {
  try {
    const raw = decompressFromEncodedURIComponent(hash);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function encodeOverrides(overrides) {
  return compressToEncodedURIComponent(JSON.stringify(overrides));
}

function loadInitialOverrides() {
  // 1. Check URL hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const fromUrl = decodeOverrides(hash);
    if (fromUrl) {
      // Clear hash so it doesn't stick around
      history.replaceState(null, '', window.location.pathname + window.location.search);
      return fromUrl;
    }
  }
  // 2. Check localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

export function useConfig() {
  const [overrides, setOverrides] = useState(loadInitialOverrides);

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides)); }
    catch { /* storage may be full or unavailable */ }
  }, [overrides]);

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
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const importConfig = useCallback((jsonString) => {
    const parsed = JSON.parse(jsonString);
    setOverrides(computeOverrides(parsed, defaults) || {});
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

  const getConfigJson = useCallback(() => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const shareConfig = useCallback(async () => {
    const encoded = encodeOverrides(overrides);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    await navigator.clipboard.writeText(url);
    return url;
  }, [overrides]);

  const loadPreset = useCallback((presetOverrides) => {
    setOverrides(presetOverrides);
  }, []);

  return {
    config,
    overrides,
    updateConfig,
    resetConfig,
    importConfig,
    exportConfig,
    getConfigJson,
    shareConfig,
    loadPreset,
  };
}
