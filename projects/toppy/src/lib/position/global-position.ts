import { InsidePlacement } from '../models';
import { Position } from './position';

export interface Config {
  placement?: InsidePlacement;
  offset?: number;
  hostWidth?: string | number;
  hostHeight?: string | number;
}
export class GlobalPosition extends Position {
  private size;
  protected _config: Config = { placement: InsidePlacement.CENTER, hostWidth: 500, hostHeight: 500, offset: 0 };
  constructor(config: Config) {
    super();
    this._config = { ...this._config, ...config };
  }
  getPositions(hostElement?: HTMLElement) {
    const host = hostElement.getBoundingClientRect();
    const src = {
      width: (window as any).innerWidth,
      height: (window as any).innerHeight
    };
    const props = this[`calculate_${this._config.placement}`](src, host);
    return { ...props, width: this._config.hostWidth, height: this._config.hostHeight, position: 'fixed' };
  }

  private [`calculate_${InsidePlacement.TOP}`](src, host) {
    const top = this._config.offset;
    const left = (src.width - host.width) / 2;
    return { left, top };
  }
  private [`calculate_${InsidePlacement.BOTTOM}`](src, host) {
    const bottom = this._config.offset;
    const left = (src.width - host.width) / 2;
    return { left, bottom };
  }
  private [`calculate_${InsidePlacement.LEFT}`](src, host) {
    const top = (src.height - host.height) / 2;
    const left = this._config.offset;
    return { left, top };
  }
  private [`calculate_${InsidePlacement.RIGHT}`](src, host) {
    const top = (src.height - host.height) / 2;
    const right = this._config.offset;
    return { right, top };
  }
  private [`calculate_${InsidePlacement.CENTER}`](src, host) {
    const top = (src.height - host.height) / 2;
    const left = (src.width - host.width) / 2;
    return { left, top };
  }
  private [`calculate_${InsidePlacement.TOP_LEFT}`](src, host) {
    const top = this._config.offset;
    const left = this._config.offset;
    return { left, top };
  }
  private [`calculate_${InsidePlacement.TOP_RIGHT}`](src, host) {
    const top = this._config.offset;
    const right = this._config.offset;
    return { right, top };
  }
  private [`calculate_${InsidePlacement.BOTTOM_LEFT}`](src, host) {
    const bottom = this._config.offset;
    const left = this._config.offset;
    return { left, bottom };
  }
  private [`calculate_${InsidePlacement.BOTTOM_RIGHT}`](src, host) {
    const bottom = this._config.offset;
    const right = this._config.offset;
    return { right, bottom };
  }
}
