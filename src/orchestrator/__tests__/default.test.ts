import DefaultTipOrchestrator from '../default';
import { TipLoader, Tip } from '../../loaders';
import { TipSelector } from '../../selectors';
import { TipFormatter } from '../../formatters';

describe('DefaultTipOrchestrator', () => {
  let mockLoader: TipLoader;
  let mockSelector: TipSelector;
  let mockFormatter: TipFormatter<string>;
  let tips: Tip[];

  beforeEach(() => {
    tips = [
      { title: 'Tip 1', tip: 'Content 1' },
      { title: 'Tip 2', tip: 'Content 2' },
    ];

    mockLoader = {
      getTips: jest.fn().mockReturnValue(tips),
    };

    mockSelector = {
      getTip: jest.fn().mockReturnValue(tips[0]),
    };

    mockFormatter = {
      formatTip: jest.fn().mockReturnValue('Formatted Tip'),
    };
  });

  it('should load tips from loader on construction', () => {
    new DefaultTipOrchestrator(mockLoader, mockSelector, mockFormatter);

    expect(mockLoader.getTips).toHaveBeenCalled();
  });

  it('should select and format a tip', () => {
    const orchestrator = new DefaultTipOrchestrator(mockLoader, mockSelector, mockFormatter);

    const result = orchestrator.getTip();

    expect(mockSelector.getTip).toHaveBeenCalledWith(tips);
    expect(mockFormatter.formatTip).toHaveBeenCalledWith(tips[0], undefined);
    expect(result).toBe('Formatted Tip');
  });
});
