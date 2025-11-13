import { JsonTipLoader } from '../json-tip-loader';
import path from 'node:path';

describe('JsonTipLoader', () => {
  it('should load tips from a JSON file', () => {
    const loader = new JsonTipLoader(
      path.resolve(__dirname, '../../../collections/leadership-tone.json')
    );

    const tips = loader.getTips();

    expect(Array.isArray(tips)).toBe(true);
    expect(tips.length).toBeGreaterThan(0);
    expect(tips[0]).toHaveProperty('title');
    expect(tips[0]).toHaveProperty('tip');
  });

  it('should return the same tips on multiple calls', () => {
    const loader = new JsonTipLoader(
      path.resolve(__dirname, '../../../collections/leadership-tone.json')
    );

    const tips1 = loader.getTips();
    const tips2 = loader.getTips();

    expect(tips1).toEqual(tips2);
  });
});
