import { TipSelector } from '.';
import { Tip } from '../loaders';

export default class RandomTipSelector implements TipSelector {
  getTip(tips: Tip[]): Tip {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }
}
