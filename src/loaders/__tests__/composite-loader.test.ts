import { CompositeTipLoader } from '../composite-loader';
import { TipLoader, Tip } from '../index';

describe('CompositeTipLoader', () => {
  let mockLoader1: TipLoader;
  let mockLoader2: TipLoader;
  let mockLoader3: TipLoader;
  let tips1: Tip[];
  let tips2: Tip[];
  let tips3: Tip[];

  beforeEach(() => {
    tips1 = [
      { title: 'Tip 1', tip: 'Content 1' },
      { title: 'Tip 2', tip: 'Content 2' },
    ];

    tips2 = [{ title: 'Tip 3', tip: 'Content 3' }];

    tips3 = [
      { title: 'Tip 4', tip: 'Content 4' },
      { title: 'Tip 5', tip: 'Content 5' },
    ];

    mockLoader1 = {
      getTips: jest.fn().mockReturnValue(tips1),
      getCollectionTitle: jest.fn().mockReturnValue('Collection 1'),
    };

    mockLoader2 = {
      getTips: jest.fn().mockReturnValue(tips2),
      getCollectionTitle: jest.fn().mockReturnValue('Collection 2'),
    };

    mockLoader3 = {
      getTips: jest.fn().mockReturnValue(tips3),
      getCollectionTitle: jest.fn().mockReturnValue('Collection 3'),
    };
  });

  it('should combine tips from multiple loaders', () => {
    const compositeLoader = new CompositeTipLoader([mockLoader1, mockLoader2]);

    const result = compositeLoader.getTips();

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { title: 'Tip 1 *Collection 1*', tip: 'Content 1' },
      { title: 'Tip 2 *Collection 1*', tip: 'Content 2' },
      { title: 'Tip 3 *Collection 2*', tip: 'Content 3' },
    ]);
  });

  it('should combine collection titles with comma separator', () => {
    const compositeLoader = new CompositeTipLoader([mockLoader1, mockLoader2]);

    const title = compositeLoader.getCollectionTitle?.();

    expect(title).toBe('Collection 1, Collection 2');
  });

  it('should handle empty loader array', () => {
    const compositeLoader = new CompositeTipLoader([]);

    const result = compositeLoader.getTips();
    const title = compositeLoader.getCollectionTitle?.();

    expect(result).toEqual([]);
    expect(title).toBe('');
  });

  it('should handle single loader', () => {
    const compositeLoader = new CompositeTipLoader([mockLoader1]);

    const result = compositeLoader.getTips();
    const title = compositeLoader.getCollectionTitle?.();

    expect(result).toEqual([
      { title: 'Tip 1 *Collection 1*', tip: 'Content 1' },
      { title: 'Tip 2 *Collection 1*', tip: 'Content 2' },
    ]);
    expect(title).toBe('Collection 1');
  });

  it('should handle three or more loaders', () => {
    const compositeLoader = new CompositeTipLoader([mockLoader1, mockLoader2, mockLoader3]);

    const result = compositeLoader.getTips();
    const title = compositeLoader.getCollectionTitle?.();

    expect(result).toHaveLength(5);
    expect(result).toEqual([
      { title: 'Tip 1 *Collection 1*', tip: 'Content 1' },
      { title: 'Tip 2 *Collection 1*', tip: 'Content 2' },
      { title: 'Tip 3 *Collection 2*', tip: 'Content 3' },
      { title: 'Tip 4 *Collection 3*', tip: 'Content 4' },
      { title: 'Tip 5 *Collection 3*', tip: 'Content 5' },
    ]);
    expect(title).toBe('Collection 1, Collection 2, Collection 3');
  });

  it('should handle loaders without getCollectionTitle method', () => {
    const loaderWithoutTitle: TipLoader = {
      getTips: jest.fn().mockReturnValue(tips1),
    };

    const compositeLoader = new CompositeTipLoader([loaderWithoutTitle, mockLoader2]);

    const result = compositeLoader.getTips();
    const title = compositeLoader.getCollectionTitle?.();

    expect(result).toEqual([
      { title: 'Tip 1', tip: 'Content 1' },
      { title: 'Tip 2', tip: 'Content 2' },
      { title: 'Tip 3 *Collection 2*', tip: 'Content 3' },
    ]);
    expect(title).toBe('Collection 2');
  });

  it('should handle mix of loaders with and without titles', () => {
    const loaderWithoutTitle: TipLoader = {
      getTips: jest.fn().mockReturnValue(tips2),
    };

    const compositeLoader = new CompositeTipLoader([mockLoader1, loaderWithoutTitle, mockLoader3]);

    const result = compositeLoader.getTips();
    const title = compositeLoader.getCollectionTitle?.();

    expect(result).toEqual([
      { title: 'Tip 1 *Collection 1*', tip: 'Content 1' },
      { title: 'Tip 2 *Collection 1*', tip: 'Content 2' },
      { title: 'Tip 3', tip: 'Content 3' },
      { title: 'Tip 4 *Collection 3*', tip: 'Content 4' },
      { title: 'Tip 5 *Collection 3*', tip: 'Content 5' },
    ]);
    expect(title).toBe('Collection 1, Collection 3');
  });

  it('should handle loaders with empty tip arrays', () => {
    const emptyLoader: TipLoader = {
      getTips: jest.fn().mockReturnValue([]),
      getCollectionTitle: jest.fn().mockReturnValue('Empty Collection'),
    };

    const compositeLoader = new CompositeTipLoader([mockLoader1, emptyLoader, mockLoader2]);

    const result = compositeLoader.getTips();
    const title = compositeLoader.getCollectionTitle?.();

    expect(result).toEqual([
      { title: 'Tip 1 *Collection 1*', tip: 'Content 1' },
      { title: 'Tip 2 *Collection 1*', tip: 'Content 2' },
      { title: 'Tip 3 *Collection 2*', tip: 'Content 3' },
    ]);
    expect(title).toBe('Collection 1, Empty Collection, Collection 2');
  });

  it('should append collection title to tip titles with italic styling', () => {
    const compositeLoader = new CompositeTipLoader([mockLoader1, mockLoader2]);

    const result = compositeLoader.getTips();

    expect(result[0].title).toBe('Tip 1 *Collection 1*');
    expect(result[1].title).toBe('Tip 2 *Collection 1*');
    expect(result[2].title).toBe('Tip 3 *Collection 2*');
  });
});
