import { PositionCoOrds, SlidePlacement } from '../models';
import { Position } from './position';

export class SlidePosition extends Position {
  private _config: { placement: SlidePlacement; width: string } = { placement: SlidePlacement.LEFT, width: '30%' };
  constructor(config) {
    super();
    this._config = { ...this._config, ...config };
  }
  updateConfig(newConfig) {
    this._config = { ...this._config, ...newConfig };
  }
  getPositions(): PositionCoOrds {
    const props = this._config.placement === SlidePlacement.LEFT ? { left: 0 } : { right: 0 };
    return { ...props, top: 0, width: this._config.width, height: '100%', position: 'fixed' };
  }
}
