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
});
