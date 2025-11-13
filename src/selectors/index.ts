import { Tip } from '../loaders';
import RandomTipSelector from './random-tip';
import { PoisonTipSelector } from './poison-selector';

export interface TipSelector {
  getTip(tips: Tip[]): Tip;
}

export default {
  RandomTipSelector,
  PoisonTipSelector,
};
