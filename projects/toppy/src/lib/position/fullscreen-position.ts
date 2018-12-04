import { PositionCoOrds } from '../models';
import { Position } from './position';

export class FullscreenPosition extends Position {
  constructor() {
    super();
  }
  getPositions(): PositionCoOrds {
    return { top: 0, left: 0, width: '100%', height: '100%', position: 'fixed' };
  }
}
