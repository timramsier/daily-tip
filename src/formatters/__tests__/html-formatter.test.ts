import { HtmlTipFormatter } from '../html-formatter';
import { Tip } from '../../loaders';

describe('HtmlTipFormatter', () => {
  let formatter: HtmlTipFormatter;

  beforeEach(() => {
    formatter = new HtmlTipFormatter();
  });

  it('should format a tip as HTML', () => {
    const tip: Tip = {
      title: 'Test Title',
      tip: 'This is a test tip.',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('<h3>Test Title</h3>');
    expect(result).toContain('<p>This is a test tip.</p>');
  });

  it('should convert markdown bold to HTML strong', () => {
    const tip: Tip = {
      title: 'Title',
      tip: '**Bold text**',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('<strong>Bold text</strong>');
  });

  it('should convert markdown italic to HTML em', () => {
    const tip: Tip = {
      title: 'Title',
      tip: '*Italic text*',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('<em>Italic text</em>');
  });

  it('should convert markdown lists to HTML ul/li', () => {
    const tip: Tip = {
      title: 'Title',
      tip: '- Item one\n- Item two',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item one</li>');
    expect(result).toContain('<li>Item two</li>');
  });

  it('should style collection title in italic format with smaller grey text', () => {
    const tip: Tip = {
      title: 'Test Title *Collection Name*',
      tip: 'This is a test tip.',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('Test Title');
    expect(result).toContain(
      '<div style="font-size: 0.7em; color: #999; font-style: italic;">Collection Name</div>'
    );
    expect(result).not.toContain('*Collection Name*');
  });

  it('should handle titles without collection names', () => {
    const tip: Tip = {
      title: 'Regular Title',
      tip: 'This is a test tip.',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('<h3>Regular Title</h3>');
  });

  it('should only style italic text at the end of title', () => {
    const tip: Tip = {
      title: 'Title with *emphasis* and *Collection*',
      tip: 'This is a test tip.',
    };

    const result = formatter.formatTip(tip);

    // First italic should remain as markdown em
    expect(result).toContain('<em>emphasis</em>');
    // Last italic should be styled as collection
    expect(result).toContain(
      '<div style="font-size: 0.7em; color: #999; font-style: italic;">Collection</div>'
    );
  });
});
