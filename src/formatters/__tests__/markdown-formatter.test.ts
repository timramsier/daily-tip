import { MarkdownTipFormatter } from '../markdown-formatter';
import { Tip } from '../../loaders';

describe('MarkdownTipFormatter', () => {
  let formatter: MarkdownTipFormatter;

  beforeEach(() => {
    formatter = new MarkdownTipFormatter();
  });

  it('should format a tip with title and content', () => {
    const tip: Tip = {
      title: 'Test Title',
      tip: 'This is a test tip.',
    };

    const result = formatter.formatTip(tip);

    expect(result).toBe('### Test Title\n\nThis is a test tip.');
  });

  it('should handle tips with markdown content', () => {
    const tip: Tip = {
      title: 'Bold Title',
      tip: '**Bold text** and *italic text*',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('### Bold Title');
    expect(result).toContain('**Bold text** and *italic text*');
  });
});
