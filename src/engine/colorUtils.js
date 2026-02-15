// Hex ↔ HSL conversion utilities

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Derive a full color palette from a single primary hex color
export function deriveColors(primaryHex) {
  const [r, g, b] = hexToRgb(primaryHex);
  const [h, s] = rgbToHsl(r, g, b);

  return {
    primary: primaryHex,
    primaryLight: hslToHex(h, s * 0.9, 83),
    primaryMuted: hslToHex(h, s * 0.85, 90),
    primaryFaint: hslToHex(h, s * 0.8, 95),
    ink: hslToHex(h, s * 0.35, 24),
    background: '#fdfdfd',
    pageBackground: '#e8e0d6',
    border: hslToHex(h, s * 0.75, 78),
    borderLight: hslToHex(h, s * 0.7, 88),
    diamondFill: hslToHex(h, s * 0.7, 93),
    diamondStroke: hslToHex(h, s * 0.75, 78),
  };
}
