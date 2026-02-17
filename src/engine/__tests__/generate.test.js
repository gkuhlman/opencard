import { describe, it, expect } from 'vitest';
import { deepMerge, generatePage } from '../generate';
import defaults from '../defaults.json';

describe('generatePage', () => {
  it('produces valid HTML with default config', () => {
    const html = generatePage(defaults);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
    expect(html).toContain('Scorecard');
  });

  it('includes both away and home sections by default', () => {
    const html = generatePage(defaults);
    expect(html).toContain('Top');
    expect(html).toContain('Bottom');
    // Two print-page divs
    expect(html.match(/class="print-page"/g).length).toBe(2);
  });

  it('renders only home when pages=home', () => {
    const config = deepMerge(defaults, { pages: 'home' });
    const html = generatePage(config);
    expect(html).not.toContain('>Top ');
    expect(html).toContain('>Bottom ');
    expect(html.match(/class="print-page"/g).length).toBe(1);
  });

  it('renders only away when pages=away', () => {
    const config = deepMerge(defaults, { pages: 'away' });
    const html = generatePage(config);
    expect(html).toContain('>Top ');
    expect(html).not.toContain('>Bottom ');
    expect(html.match(/class="print-page"/g).length).toBe(1);
  });

  it('hides header when header.show is false', () => {
    const config = deepMerge(defaults, { header: { show: false } });
    const html = generatePage(config);
    expect(html).not.toContain('class="game-header"');
  });

  it('renders the correct number of innings', () => {
    const config = deepMerge(defaults, { grid: { innings: 9 } });
    const html = generatePage(config);
    expect(html).toContain('<th class="col-inning">9</th>');
    expect(html).not.toContain('<th class="col-inning">10</th>');
  });

  it('renders stat columns', () => {
    const html = generatePage(defaults);
    expect(html).toContain('>AB<');
    expect(html).toContain('>RBI<');
  });

  it('hides outcomes when outcomes.show is false', () => {
    const config = deepMerge(defaults, { cell: { outcomes: { show: false } } });
    const html = generatePage(config);
    expect(html).not.toContain('class="outcome-labels"');
  });

  it('hides diamond when diamond.show is false', () => {
    const config = deepMerge(defaults, { cell: { diamond: { show: false } } });
    const html = generatePage(config);
    expect(html).not.toContain('class="diamond-wrap"');
  });

  it('hides count when count.show is false', () => {
    const config = deepMerge(defaults, { cell: { count: { show: false } } });
    const html = generatePage(config);
    expect(html).not.toContain('class="count-tracker"');
  });

  it('renders substitution lines when enabled', () => {
    const config = deepMerge(defaults, { grid: { substitutionLine: true } });
    const html = generatePage(config);
    expect(html).toContain('class="sub-line"');
  });

  it('does not render substitution lines by default', () => {
    const html = generatePage(defaults);
    expect(html).not.toContain('class="sub-line"');
  });

  it('applies custom colors to CSS variables', () => {
    const config = deepMerge(defaults, {
      theme: { colors: { primary: '#ff0000' } },
    });
    const html = generatePage(config);
    expect(html).toContain('--primary: #ff0000');
  });

  it('handles small page sizes', () => {
    const config = deepMerge(defaults, { page: { size: '4X6' } });
    const html = generatePage(config);
    // In landscape mode, 6in x 4in
    expect(html).toContain('6in 4in');
  });

  it('escapes HTML in name field', () => {
    const config = deepMerge(defaults, { name: '<script>alert("xss")</script>' });
    const html = generatePage(config);
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
  });
});
