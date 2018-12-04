import { OutsidePlacement, PositionCoOrds } from '../models';
import { Position } from './position';

export interface Config {
  src?: HTMLElement;
  placement?: OutsidePlacement;
  autoUpdate?: boolean;
  hostWidth?: string | number;
  hostHeight?: string | number;
}

export class RelativePosition extends Position {
  protected _config: Config = {
    src: null,
    placement: OutsidePlacement.TOP,
    autoUpdate: false,
    hostWidth: '100%',
    hostHeight: '100%'
  };
  _mutationObserver: MutationObserver;
  constructor(config: Config) {
    super();
    this._config = { ...this._config, ...config };
    if (this._config.autoUpdate) {
      this._watchElementPositionChange();
    }
  }

  getPositions(hostElement: HTMLElement): PositionCoOrds {
    const s = this.getCoords(this._config.src);
    const h = this.getCoords(hostElement);

    if (this._config.hostWidth === '100%') {
      this._config.hostWidth = s.width;
    }

    if (this._config.hostHeight === '100%') {
      this._config.hostHeight = 'auto';
    }
    if (typeof this._config.hostHeight === 'number') {
      h.height = this._config.hostHeight;
    }
    if (typeof this._config.hostWidth === 'number') {
      h.width = this._config.hostWidth;
    }
    const props = this.calculatePos(this._config.placement, s, h);
    return { ...this.round(props), width: this._config.hostWidth, height: this._config.hostHeight };
  }

  private getSize(el): { x: number; y: number } {
    const { offsetWidth, offsetHeight } = el;
    const [x, y] = [offsetWidth, offsetHeight];
    return { x, y };
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

  private resetCoOrds(element: HTMLElement) {
    // element.style.width = '';
    // element.style.height = '';
    element.style.top = '';
    element.style.bottom = '';
    element.style.left = '';
    element.style.right = '';
    return element;
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
    // return this[`calculate_${pos}`](s, h);
  }

  private calculatePos(pos, s, h, c = true) {
    const props = this.getProps(pos, s, h);
    if (!c) {
      return props;
    }
    if (this._config.autoUpdate && this.isOverflowed({ ...props, width: h.width, height: h.height })) {
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
    Object.keys(props).forEach(x => {
      props[x] = Math.round(props[x]);
    });
    return props;
  }

  private _watchElementPositionChange() {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }
    this._mutationObserver = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          this.eventBus.post({ name: 'NEW_DYN_POS', data: null });
        }
      }
    });

    this._mutationObserver.observe(this._config.src, {
      attributes: true,
      childList: false,
      subtree: false,
      attributeOldValue: true,
      attributeFilter: ['style']
    });
  }
}
