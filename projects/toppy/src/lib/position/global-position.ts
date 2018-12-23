import { InsidePlacement } from '../models';
import { ToppyPosition } from './position';

export interface Config {
  placement?: InsidePlacement;
  offset?: number;
  width?: string | number;
  height?: string | number;
}
export class GlobalPosition extends ToppyPosition {
  protected config: Config = { placement: InsidePlacement.CENTER, width: 100, height: 100, offset: 0 };
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
    if (typeof this.config.height === 'number') {
      host.height = this.config.height = Math.abs(this.config.height);
    }
    if (typeof this.config.width === 'number') {
      host.width = this.config.width = Math.abs(this.config.width);
    }
    if (typeof this.config.width === 'string' && this.config.width.endsWith('%')) {
      this.config.width = this.getPercentageToCssPx(src.width, this.config.width);
    }
    if (typeof this.config.height === 'string' && this.config.height.endsWith('%')) {
      this.config.height = this.getPercentageToCssPx(src.height, this.config.height);
    }

    const props = this.calc(this.config.placement, src, host);
    return {
      ...props,
      width: this.config.width,
      height: this.config.height,
      position: 'fixed',
      extra: this.config.placement
    };
  }
  private getPercentageToCssPx(max, percentage: string): string {
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
