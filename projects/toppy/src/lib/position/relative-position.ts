import { OutsidePlacement, PositionCoOrds } from '../models';
import { Bus } from '../utils';
import { Position } from './position';

export interface Config {
  src?: HTMLElement;
  placement?: OutsidePlacement;
  autoUpdate?: boolean;
  hostWidth?: string | number;
  hostHeight?: string | number;
}

export class RelativePosition extends Position {
  protected config: Config = {
    src: null,
    placement: OutsidePlacement.TOP,
    autoUpdate: false,
    hostWidth: '100%',
    hostHeight: '100%'
  };
  obs: MutationObserver;
  constructor(config: Config) {
    super();
    this.config = { ...this.config, ...config };
  }

  init(tid: string): void {
    if (this.config.autoUpdate) this.listenDrag(tid);
  }

  getPositions(hostElement: HTMLElement): PositionCoOrds {
    const s = this.getCoords(this.config.src);
    const h = this.getCoords(hostElement);

    if (this.config.hostWidth === '100%') {
      this.config.hostWidth = s.width;
    }

    if (this.config.hostHeight === '100%') {
      this.config.hostHeight = 'auto';
    }
    if (typeof this.config.hostHeight === 'number') {
      h.height = this.config.hostHeight;
    }
    if (typeof this.config.hostWidth === 'number') {
      h.width = this.config.hostWidth;
    }
    const props = this.calculatePos(this.config.placement, s, h);
    return { ...this.round(props), width: this.config.hostWidth, height: this.config.hostHeight };
  }

  private getCoords(elem: HTMLElement): PositionCoOrds {
    const box: any = elem.getBoundingClientRect();

    const body = document.body;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return {
      top: Math.round(box.top),
      left: Math.round(box.left),
      height: box.height,
      right: box.right,
      bottom: box.bottom,
      width: box.width
    };
  }

  private calc(placement: OutsidePlacement, src, host) {
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

  private getProps(pos, s, h) {
    return this.calc(pos, s, h);
  }

  private calculatePos(pos, s, h, c = true) {
    const props = this.getProps(pos, s, h);
    if (!c) {
      return props;
    }
    if (this.config.autoUpdate && this.isOverflowed({ ...props, width: h.width, height: h.height })) {
      return this.calculatePos(this.nextPosition(pos), s, h, false);
    }

    return props;
  }

  private isOverflowed(props) {
    const { innerHeight, innerWidth } = window;
    props.bottom = props.top + props.height;
    props.right = props.left + props.width;
    return props.bottom > innerHeight || props.top <= 0 || props.left <= 0 || props.right > innerWidth;
  }

  private nextPosition(current) {
    const placements = [
      OutsidePlacement.TOP,
      OutsidePlacement.BOTTOM,
      OutsidePlacement.LEFT,
      OutsidePlacement.RIGHT,
      OutsidePlacement.TOP_LEFT,
      OutsidePlacement.TOP_RIGHT,
      OutsidePlacement.BOTTOM_LEFT,
      OutsidePlacement.BOTTOM_RIGHT,
      OutsidePlacement.LEFT_TOP,
      OutsidePlacement.LEFT_BOTTOM,
      OutsidePlacement.RIGHT_TOP,
      OutsidePlacement.RIGHT_BOTTOM
    ];

    const index = placements.indexOf(current);
    const even = index % 2 === 0;
    return even ? placements[index + 1] : placements[index - 1];
  }

  private round(props) {
    Object.keys(props).forEach(x => (props[x] = Math.round(props[x])));
    return props;
  }

  private listenDrag(tid: string) {
    if (this.obs) this.obs.disconnect();
    this.obs = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') Bus.send(tid, 't_dynpos');
      }
    });

    this.obs.observe(this.config.src, {
      // attributes: true,
      attributeFilter: ['style']
    });
  }
}
