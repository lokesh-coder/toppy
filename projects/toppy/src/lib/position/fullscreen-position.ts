import { PositionMeta } from '../models';
import { ToppyPosition } from './position';

export class FullscreenPosition extends ToppyPosition {
  constructor() {
    super();
  }
  getPositions(): PositionMeta {
    return { top: 0, left: 0, width: '100%', height: '100%', position: 'fixed' };
  }
}
