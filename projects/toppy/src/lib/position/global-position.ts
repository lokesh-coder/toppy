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
  private _config: Config = { placement: InsidePlacement.CENTER, hostWidth: 500, hostHeight: 500, offset: 0 };
  constructor(config: Config) {
    super();
    this._config = { ...this._config, ...config };
  }
  updateConfig(newConfig) {
    this._config = { ...this._config, ...newConfig };
  }
  getPositions(hostElement?: HTMLElement) {
    const host = hostElement.getBoundingClientRect();
    let props;
    const src = {
      width: (window as any).innerWidth,
      height: (window as any).innerHeight
    };
    switch (this._config.placement) {
      case InsidePlacement.TOP:
        props = this.calculateTop(src, host);
        break;
      case InsidePlacement.BOTTOM:
        props = this.calculateBottom(src, host);
        break;
      case InsidePlacement.LEFT:
        props = this.calculateLeft(src, host);
        break;
      case InsidePlacement.RIGHT:
        props = this.calculateRight(src, host);
        break;
      case InsidePlacement.CENTER:
        props = this.calculateCenter(src, host);
        break;
      case InsidePlacement.TOP_LEFT:
        props = this.calculateTopLeft(src, host);
        break;
      case InsidePlacement.TOP_RIGHT:
        props = this.calculateTopRight(src, host);
        break;
      case InsidePlacement.BOTTOM_LEFT:
        props = this.calculateBottomLeft(src, host);
        break;
      case InsidePlacement.BOTTOM_RIGHT:
        props = this.calculateBottomRight(src, host);
        break;
      default:
        break;
    }
    return { ...props, width: this._config.hostWidth, height: this._config.hostHeight, position: 'fixed' };
  }

  private calculateTop(src, host) {
    const top = this._config.offset;
    const left = (src.width - host.width) / 2;
    return { left, top };
  }
  private calculateBottom(src, host) {
    const bottom = this._config.offset;
    const left = (src.width - host.width) / 2;
    return { left, bottom };
  }
  private calculateLeft(src, host) {
    const top = (src.height - host.height) / 2;
    const left = this._config.offset;
    return { left, top };
  }
  private calculateRight(src, host) {
    const top = (src.height - host.height) / 2;
    const right = this._config.offset;
    return { right, top };
  }
  private calculateCenter(src, host) {
    const top = (src.height - host.height) / 2;
    const left = (src.width - host.width) / 2;
    return { left, top };
  }
  private calculateTopLeft(src, host) {
    const top = this._config.offset;
    const left = this._config.offset;
    return { left, top };
  }
  private calculateTopRight(src, host) {
    const top = this._config.offset;
    const right = this._config.offset;
    return { right, top };
  }
  private calculateBottomLeft(src, host) {
    const bottom = this._config.offset;
    const left = this._config.offset;
    return { left, bottom };
  }
  private calculateBottomRight(src, host) {
    const bottom = this._config.offset;
    const right = this._config.offset;
    return { right, bottom };
  }
}
