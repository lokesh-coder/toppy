import { PositionCoOrds, SlidePlacement } from '../models';
import { Position } from './position';

export class SlidePosition extends Position {
  private placement: SlidePlacement;
  private width: string;
  constructor({ placement = SlidePlacement.LEFT, width = '30%' }: any) {
    super();
    this.placement = placement;
    this.width = width;
  }
  getPositions(): PositionCoOrds {
    const props = this.placement === SlidePlacement.LEFT ? { left: 0 } : { right: 0 };
    return { ...props, top: 0, width: this.width, height: '100%', position: 'fixed' };
  }
}
