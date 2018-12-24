import { InsidePlacement } from '../models';
import { setWH } from '../utils';
import { ToppyPosition } from './position';

interface GlobalPositionConfig {
  placement?: InsidePlacement;
  offset?: number;
  width?: string | number;
  height?: string | number;
}

export class GlobalPosition extends ToppyPosition {
  protected config: GlobalPositionConfig = { placement: InsidePlacement.CENTER, width: 100, height: 100, offset: 0 };

  constructor(config: GlobalPositionConfig) {
    super();
    this.updateConfig(config);
  }
  getPositions(hostEl?: HTMLElement) {
    const host = hostEl.getBoundingClientRect() as any;
    const src = {
      width: window['innerWidth'],
      height: window['innerHeight']
    };
    let { width: w, height: h } = this.config;

    w = setWH(src, host, 'width', w);
    h = setWH(src, host, 'height', h);

    const props = this.calc(this.config.placement, src, host);
    return {
      ...props,
      width: w,
      height: h,
      position: 'fixed',
      extra: this.config.placement
    };
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
