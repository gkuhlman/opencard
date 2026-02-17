// Pure utility functions for config manipulation
// Extracted so they can be tested independently of React

export function setByPath(obj, path, value) {
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
export function computeOverrides(config, defaults) {
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
