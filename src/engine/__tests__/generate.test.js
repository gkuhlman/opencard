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

  it('renders substitution lines when substitutionLines > 0', () => {
    const config = deepMerge(defaults, { grid: { substitutionLines: 1 } });
    const html = generatePage(config);
    expect(html).toContain('class="sub-line"');
  });

  it('renders multiple substitution lines', () => {
    const config = deepMerge(defaults, { grid: { substitutionLines: 2 } });
    const html = generatePage(config);
    // Each row has player + pos cells, each with 2 sub-lines
    expect(html).toContain('top:33.');
    expect(html).toContain('top:66.');
  });

  it('does not render substitution lines by default', () => {
    const html = generatePage(defaults);
    expect(html).not.toContain('class="sub-line"');
  });

  it('hides inning labels when showInningLabels is false', () => {
    const config = deepMerge(defaults, { grid: { showInningLabels: false, innings: 9 } });
    const html = generatePage(config);
    // Inning header cells should be empty
    expect(html).not.toContain('<th class="col-inning">1</th>');
    expect(html).toContain('<th class="col-inning"></th>');
  });

  it('shows inning labels by default', () => {
    const html = generatePage(defaults);
    expect(html).toContain('<th class="col-inning">1</th>');
  });

  it('hides header on second page when showOnSecondPage is false', () => {
    const config = deepMerge(defaults, { header: { showOnSecondPage: false } });
    const html = generatePage(config);
    // Away page should still have header
    const pages = html.split('class="print-page"');
    // First page (away) should have header
    expect(pages[1]).toContain('class="game-header"');
    // Second page (home) should not have header
    expect(pages[2]).not.toContain('class="game-header"');
  });

  it('renders consolidated scoreboard with R/H/E in same table', () => {
    const html = generatePage(defaults);
    // Should have totals columns in the same table as innings
    expect(html).toContain('class="scoreboard-totals"');
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
