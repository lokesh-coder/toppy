import { OutsidePlacement, PositionMeta } from '../models';
import { Bus, setWH } from '../utils';
import { ToppyPosition } from './position';

interface RelativePositionConfig {
  src?: HTMLElement;
  placement?: OutsidePlacement;
  autoUpdate?: boolean;
  width?: string | number;
  height?: string | number;
}

export class RelativePosition extends ToppyPosition {
  protected config: RelativePositionConfig = {
    src: null,
    placement: OutsidePlacement.TOP,
    autoUpdate: false,
    width: 'auto',
    height: 'auto'
  };
  obs: MutationObserver;
  constructor(config: RelativePositionConfig) {
    super();
    this.updateConfig(config);
  }
  init(tid: string): void {
    if (this.config.autoUpdate) this.listenDrag(tid);
  }

  getPositions(targetEl: HTMLElement): Pick<PositionMeta, any> {
    const s = this.getCoords(this.config.src);
    const h = this.getCoords(targetEl);
    let { width: w, height: ht } = this.config;

    w = setWH(s, h, 'width', w);
    ht = setWH(s, h, 'height', ht);

    const { pos, props } = this.calculatePos(this.config.placement, s, h);
    return { ...this.round(props), width: w, height: ht, extra: pos };
  }

  private getCoords(elem: HTMLElement): PositionMeta {
    return elem.getBoundingClientRect();
  }

  private calc(placement: OutsidePlacement, src, host): object {
    const [main, sub] = placement.split('');
    const p = { left: 0, top: 0 };
    if ((main === 't' || main === 'b') && !sub) {
      p.left = src.left + (src.width - host.width) / 2;
    }

    if ((main === 't' || main === 'b') && sub) {
      p.left = src.left;
    }
    if ((main === 't' || main === 'b') && sub === 'r') {
      p.left = src.left + src.width - host.width;
    }
    if (main === 'l') {
      p.left = src.left - host.width;
    }
    if (main === 'r') {
      p.left = src.right;
    }

    if (main === 't') {
      p.top = src.top - host.height;
    }
    if (main === 'b') {
      p.top = src.top + src.height;
    }
    if (main === 'l' || main === 'r') {
      p.top = src.top + (src.height - host.height) / 2;
    }
    if (sub === 't' && (main === 'l' || main === 'r')) {
      p.top = src.top;
    }
    if (sub === 'b' && (main === 'l' || main === 'r')) {
      p.top = src.top + src.height - host.height;
    }
    return p;
  }

  private calculatePos(pos, s, h, c = true): { [x: string]: any } {
    const props = this.calc(pos, s, h);

    if (c && this.config.autoUpdate && this.isOverflowed({ ...props, width: h.width, height: h.height })) {
      return this.calculatePos(this.nextPosition(pos), s, h, false);
    }

    return { pos, props };
  }

  private isOverflowed(props: { [x: string]: any }): boolean {
    const { innerHeight, innerWidth } = window;
    props.bottom = props.top + props.height;
    props.right = props.left + props.width;
    return props.bottom > innerHeight || props.top <= 0 || props.left <= 0 || props.right > innerWidth;
  }

  private nextPosition(current: OutsidePlacement): string {
    const placements = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br', 'lt', 'lb', 'rt', 'rb'];

    const index = placements.indexOf(current);
    const even = index % 2 === 0;
    return even ? placements[index + 1] : placements[index - 1];
  }

  private round(props: object): object {
    Object.keys(props).forEach(x => (props[x] = Math.round(props[x])));
    return props;
  }

  private listenDrag(tid: string): void {
    if (this.obs) this.obs.disconnect();
    this.obs = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') Bus.send(tid, 't_dynpos');
      }
    });

    this.obs.observe(this.config.src, {
      attributeFilter: ['style']
    });
  }
}
