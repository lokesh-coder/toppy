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
  protected config: Config = { placement: InsidePlacement.CENTER, hostWidth: 100, hostHeight: 100, offset: 0 };
  constructor(config: Config) {
    super();
    this.config = { ...this.config, ...config };
  }
  getPositions(hostElement?: HTMLElement) {
    const host = hostElement.getBoundingClientRect() as any;
    const src = {
      width: (window as any).innerWidth,
      height: (window as any).innerHeight
    };

    // todo: refactor
    if (typeof this.config.hostHeight === 'number') {
      host.height = this.config.hostHeight = Math.abs(this.config.hostHeight);
    }
    if (typeof this.config.hostWidth === 'number') {
      host.width = this.config.hostWidth = Math.abs(this.config.hostWidth);
    }
    if (typeof this.config.hostWidth === 'string' && this.config.hostWidth.endsWith('%')) {
      this.config.hostWidth = this.getPercentageToCssPx(src.width, this.config.hostWidth);
    }
    if (typeof this.config.hostHeight === 'string' && this.config.hostHeight.endsWith('%')) {
      this.config.hostHeight = this.getPercentageToCssPx(src.height, this.config.hostHeight);
    }

    const props = this.calc(this.config.placement, src, host);
    return { ...props, width: this.config.hostWidth, height: this.config.hostHeight, position: 'fixed' };
  }
  private getPercentageToCssPx(max, percentage: string) {
    let number = Number(percentage.slice(0, -1));
    if (number > 100) {
      number = 100;
    }
    return `calc(${max}px - ${100 - number}%)`;
  }

  private calc(placement: InsidePlacement, src, host) {
    const [main, sub] = placement.split('');
    const p: any = {};

    if (main === 't') {
      p.top = this.config.offset;
    }
    if (main === 'b') {
      p.bottom = this.config.offset;
    }
    if ((main === 'l' || main === 'r' || main === 'c') && !sub) {
      p.top = (src.height - host.height) / 2;
    }

    if ((main === 't' || main === 'b' || main === 'c') && !sub) {
      p.left = (src.width - host.width) / 2;
    }
    if ((main === 'l' && !sub) || sub === 'l') {
      p.left = this.config.offset;
    }
    if ((main === 'r' && !sub) || sub === 'r') {
      p.right = this.config.offset;
    }

    return p;
  }
}
