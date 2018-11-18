import { PositionCoOrds } from '../models';
import { Position } from './position';

export class DefaultPosition extends Position {
  constructor() {
    super();
  }
  updateConfig(newConfig) {
    return null;
  }
  getPositions(hostElement?: HTMLElement): PositionCoOrds {
    return {};
  }
}
