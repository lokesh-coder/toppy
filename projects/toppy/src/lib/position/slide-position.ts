import { PositionCoOrds, SlidePlacement } from '../models';
import { Position } from './position';

export class SlidePosition extends Position {
  protected config: { placement: SlidePlacement; width: string } = { placement: SlidePlacement.LEFT, width: '30%' };
  constructor(config) {
    super();
    this.config = { ...this.config, ...config };
  }
  getPositions(): PositionCoOrds {
    const props = this.config.placement === SlidePlacement.LEFT ? { left: 0 } : { right: 0 };
    return { ...props, top: 0, width: this.config.width, height: '100%', position: 'fixed' };
  }
}
