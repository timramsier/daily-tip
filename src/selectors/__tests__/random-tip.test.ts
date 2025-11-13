import RandomTipSelector from '../random-tip';
import { Tip } from '../../loaders';

describe('RandomTipSelector', () => {
  let selector: RandomTipSelector;
  let tips: Tip[];

  beforeEach(() => {
    selector = new RandomTipSelector();
    tips = [
      { title: 'Tip 1', tip: 'Content 1' },
      { title: 'Tip 2', tip: 'Content 2' },
      { title: 'Tip 3', tip: 'Content 3' },
    ];
  });

  it('should return a tip from the provided array', () => {
    const result = selector.getTip(tips);

    expect(tips).toContainEqual(result);
  });

  it('should return a tip when given a single tip', () => {
    const singleTip = [{ title: 'Only Tip', tip: 'Only Content' }];
    const result = selector.getTip(singleTip);

    expect(result).toEqual(singleTip[0]);
  });

  it('should handle multiple calls', () => {
    const result1 = selector.getTip(tips);
    const result2 = selector.getTip(tips);

    expect(tips).toContainEqual(result1);
    expect(tips).toContainEqual(result2);
  });
});
