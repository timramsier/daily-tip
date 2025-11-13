import DefaultTipOrchestrator from './default';
import { PoisonTipOrchestrator } from './poison-orchestrator';

export interface TipOrchestrator<T> {
  getTip(): T;
}

export default {
  DefaultTipOrchestrator,
  PoisonTipOrchestrator,
};
