import { PositionMeta, SlidePlacement } from '../models';
import { ToppyPosition } from './position';

interface SlidePlacementConfig {
  placement: SlidePlacement;
  width: string;
}

export class SlidePosition extends ToppyPosition {
  protected config: SlidePlacementConfig = { placement: SlidePlacement.LEFT, width: '30%' };

  constructor(config: SlidePlacementConfig) {
    super();
    this.config = { ...this.config, ...config };
  }
  getPositions(): PositionMeta {
    const props = this.config.placement === SlidePlacement.LEFT ? { left: 0 } : { right: 0 };
    return {
      ...props,
      top: 0,
      width: this.config.width,
      height: '100%',
      position: 'fixed',
      extra: this.config.placement
    };
  }
}
