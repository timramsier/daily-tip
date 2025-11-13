import { TipFormatter } from '.';
import { Tip } from '../loaders';

export class PoisonTipFormatter implements TipFormatter<never> {
  formatTip(_tip: Tip): never {
    throw new Error(
      'PoisonTipFormatter: formatTip() was called but this is a poison implementation'
    );
  }
}
