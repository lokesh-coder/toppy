import { PositionCoOrds } from '../models';
import { Position } from './position';

export class DefaultPosition extends Position {
  constructor() {
    super();
  }
  getPositions(hostElement?: HTMLElement): PositionCoOrds {
    return {};
  }
}
