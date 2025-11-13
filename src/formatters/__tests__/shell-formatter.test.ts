import { ShellTipFormatter } from '../shell-formatter';
import { Tip } from '../../loaders';

jest.mock('chalk', () => {
  const mockFn = (text: string) => text;
  return {
    default: {
      bold: Object.assign(mockFn, { cyan: mockFn }),
      gray: mockFn,
      cyan: mockFn,
      yellow: mockFn,
    },
    __esModule: true,
  };
});

describe('ShellTipFormatter', () => {
  let formatter: ShellTipFormatter;

  beforeEach(() => {
    formatter = new ShellTipFormatter();
  });

  it('should format a tip with horizontal rules', () => {
    const tip: Tip = {
      title: 'Test Title',
      tip: 'Simple tip',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('─'.repeat(80));
    expect(result).toContain('Test Title');
    expect(result).toContain('Simple tip');
  });

  it('should format bold text', () => {
    const tip: Tip = {
      title: 'Title',
      tip: '**Bold text** here',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('Bold text');
  });

  it('should format bullet lists with styled bullets', () => {
    const tip: Tip = {
      title: 'Title',
      tip: '- Item one\n- Item two',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('•');
  });

  it('should format italic/quoted text', () => {
    const tip: Tip = {
      title: 'Title',
      tip: '*"Quoted text"*',
    };

    const result = formatter.formatTip(tip);

    expect(result).toContain('Quoted text');
  });
});
