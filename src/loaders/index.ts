import { JsonTipLoader } from './json-tip-loader';
import { PoisonTipLoader } from './poison-loader';

export type Tip = {
  readonly title: string;
  readonly tip: string;
};

export type TipCollection = {
  readonly title: string;
  readonly tips: Tip[];
};

export interface TipLoader {
  getTips(): Tip[];
  getCollectionTitle?(): string;
}

export default {
  JsonTipLoader,
  PoisonTipLoader,
};
