import { TipSelector } from '.';
import { Tip } from '../loaders';

export class PoisonTipSelector implements TipSelector {
  getTip(_tips: Tip[]): Tip {
    throw new Error('PoisonTipSelector: getTip() was called but this is a poison implementation');
  }
}
