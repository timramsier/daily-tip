import { TipSelector } from '.';
import { Tip } from '../loaders';

export default class RandomTipSelector implements TipSelector {
  getTip(tips: Tip[]): Tip {
    const randomIndex = this.generateRandomIndex(tips.length);
    return this.selectTipAtIndex(tips, randomIndex);
  }

  private generateRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }

  private selectTipAtIndex(tips: Tip[], index: number): Tip {
    return tips[index];
  }
}
