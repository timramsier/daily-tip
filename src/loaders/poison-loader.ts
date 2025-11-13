import { Tip, TipLoader } from '.';

export class PoisonTipLoader implements TipLoader {
  getTips(): Tip[] {
    throw new Error('PoisonTipLoader: getTips() was called but this is a poison implementation');
  }
}
