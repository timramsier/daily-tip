import { TipOrchestrator } from '.';

export class PoisonTipOrchestrator<T> implements TipOrchestrator<T> {
  getTip(): T {
    throw new Error(
      'PoisonTipOrchestrator: getTip() was called but this is a poison implementation'
    );
  }
}
