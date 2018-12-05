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
  protected _config: Config = { placement: InsidePlacement.CENTER, hostWidth: 100, hostHeight: 100, offset: 0 };
  constructor(config: Config) {
    super();
    this._config = { ...this._config, ...config };
  }
  getPositions(hostElement?: HTMLElement) {
    const host = hostElement.getBoundingClientRect() as any;
    const src = {
      width: (window as any).innerWidth,
      height: (window as any).innerHeight
    };
    if (typeof this._config.hostHeight === 'number') {
      host.height = this._config.hostHeight;
    }
    if (typeof this._config.hostWidth === 'number') {
      host.width = this._config.hostWidth;
    }
    if (typeof this._config.hostWidth === 'string' && this._config.hostWidth.endsWith('%')) {
      this._config.hostWidth = this._getPercentageToCssPx(src.width, this._config.hostWidth);
    }
    if (typeof this._config.hostHeight === 'string' && this._config.hostHeight.endsWith('%')) {
      this._config.hostHeight = this._getPercentageToCssPx(src.height, this._config.hostHeight);
    }

    const props = this[`calculate_${this._config.placement}`](src, host);
    return { ...props, width: this._config.hostWidth, height: this._config.hostHeight, position: 'fixed' };
  }
  private _getPercentageToCssPx(max, percentage: string) {
    let number = Number(percentage.slice(0, -1));
    if (number > 100) {
      number = 100;
    }
    return `calc(${max}px - ${100 - number}%)`;
  }

  private _calc(placement: InsidePlacement, src, host) {
    const [main, sub] = placement.split('');
    const p: any = {};

    if (main === 't') {
      p.top = this._config.offset;
    }
    if (main === 'b') {
      p.bottom = this._config.offset;
    }
    if ((main === 'l' || main === 'r' || main === 'c') && !sub) {
      p.top = (src.height - host.height) / 2;
    }

    if ((main === 't' || main === 'b' || main === 'c') && !sub) {
      p.left = (src.width - host.width) / 2;
    }
    if ((main === 'l' && !sub) || sub === 'l') {
      p.left = this._config.offset;
    }
    if ((main === 'r' && !sub) || sub === 'r') {
      p.right = this._config.offset;
    }

    return p;
  }

  private [`calculate_${InsidePlacement.TOP}`](src, host) {
    const top = this._config.offset; //
    const left = (src.width - host.width) / 2; //
    return { left, top };
  }
  private [`calculate_${InsidePlacement.BOTTOM}`](src, host) {
    const bottom = this._config.offset; //
    const left = (src.width - host.width) / 2; //
    return { left, bottom };
  }
  private [`calculate_${InsidePlacement.LEFT}`](src, host) {
    const top = (src.height - host.height) / 2; //
    const left = this._config.offset; //
    return { left, top };
  }
  private [`calculate_${InsidePlacement.RIGHT}`](src, host) {
    const top = (src.height - host.height) / 2; //
    const right = this._config.offset;
    return { right, top };
  }
  private [`calculate_${InsidePlacement.CENTER}`](src, host) {
    const top = (src.height - host.height) / 2; //
    const left = (src.width - host.width) / 2; //
    return { left, top };
  }
  private [`calculate_${InsidePlacement.TOP_LEFT}`](src, host) {
    const top = this._config.offset; //
    const left = this._config.offset; //
    return { left, top };
  }
  private [`calculate_${InsidePlacement.TOP_RIGHT}`](src, host) {
    const top = this._config.offset; //
    const right = this._config.offset;
    return { right, top };
  }
  private [`calculate_${InsidePlacement.BOTTOM_LEFT}`](src, host) {
    const bottom = this._config.offset; //
    const left = this._config.offset; //
    return { left, bottom };
  }
  private [`calculate_${InsidePlacement.BOTTOM_RIGHT}`](src, host) {
    const bottom = this._config.offset; //
    const right = this._config.offset;
    return { right, bottom };
  }
}
