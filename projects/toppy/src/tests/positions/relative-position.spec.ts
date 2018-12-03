/// <reference types="karma-viewport" />

import { EventBus } from '../../lib/helper/event-bus';
import { OutsidePlacement } from '../../lib/models';
import { RelativePosition } from '../../lib/position';

describe('== Relative position ==', () => {
  let targetElement: HTMLElement;
  let hostElement: HTMLElement;
  beforeEach(() => {
    targetElement = document.createElement('div');
    targetElement.setAttribute('class', 'foobar');
    const textnode = document.createTextNode('Hello');
    targetElement.appendChild(textnode);
    document.getElementsByTagName('body')[0].appendChild(targetElement);

    hostElement = document.createElement('div');
    hostElement.setAttribute('class', 'hostelement');
    const textnode2 = document.createTextNode('Im host');
    hostElement.appendChild(textnode2);
    document.getElementsByTagName('body')[0].appendChild(hostElement);
    viewport.set(1000, 480);
  });
  afterEach(() => {
    document.getElementsByTagName('body')[0].removeChild(targetElement);
    document.getElementsByTagName('body')[0].removeChild(hostElement);
  });

  it('should have target element in document', () => {
    expect(document.querySelector('.foobar').textContent).toBe('Hello');
  });
  it('should get updated config', () => {
    const relPos = new RelativePosition({});
    relPos.updateConfig({ autoUpdate: true });
    expect((relPos as any)._config).toEqual({
      src: null,
      placement: OutsidePlacement.TOP,
      autoUpdate: true,
      hostWidth: '100%',
      hostHeight: '100%'
    });
  });
  it('should return correct class name', () => {
    const relPos = new RelativePosition({});
    expect(relPos.getClassName()).toBe('relative-position');
  });
  it('should return offset size of element', () => {
    const relPos = new RelativePosition({});
    expect((relPos as any).getSize(targetElement)).toEqual({ x: 967, y: 18 });
  });
  it('should reset position props of element', () => {
    const relPos = new RelativePosition({});
    targetElement.style.top = '10px';
    expect(targetElement.style.top).toBe('10px');
    (relPos as any).resetCoOrds(targetElement);
    expect(targetElement.style.top).toBe('');
  });
  describe('should update position based on "autoUpdate"', () => {
    it('when autoUpdate is true', () => {
      const relPos = new RelativePosition({
        src: targetElement,
        placement: OutsidePlacement.TOP,
        hostHeight: 500,
        autoUpdate: true
      });
      const srcCoords = targetElement.getBoundingClientRect();
      const hostElCoords = {
        width: 4, // actual 967
        height: 450
      };
      expect((relPos as any).calculatePos(OutsidePlacement.TOP, srcCoords, hostElCoords, true)).toEqual({
        left: 8 + (srcCoords.width - 4) / 2,
        top: srcCoords.top + srcCoords.height
      });
    });
    it('when autoUpdate is false', () => {
      const relPos = new RelativePosition({
        src: targetElement,
        placement: OutsidePlacement.TOP,
        hostHeight: 500,
        autoUpdate: false
      });
      const srcCoords = targetElement.getBoundingClientRect();
      const hostElCoords = {
        width: 4, // actual 967
        height: 150
      };
      expect((relPos as any).calculatePos(OutsidePlacement.TOP, srcCoords, hostElCoords, true)).toEqual({
        left: 8 + (srcCoords.width - 4) / 2,
        top: srcCoords.top - 150
      });
    });
  });
  describe('should return correct position coords of host element', () => {
    let srcCoords;
    beforeEach(() => {
      srcCoords = targetElement.getBoundingClientRect();
    });
    it('when exact width and height is provided', () => {
      const relPos = new RelativePosition({
        hostWidth: 4,
        hostHeight: 10,
        src: targetElement,
        placement: OutsidePlacement.TOP
      });
      expect(relPos.getPositions(hostElement)).toEqual({
        left: Math.round(8 + (967 - 4) / 2),
        top: Math.round(srcCoords.top - 10),
        width: 4,
        height: 10
      });
    });
    it('when no width and height is provided', () => {
      const relPos = new RelativePosition({ src: targetElement, placement: OutsidePlacement.TOP });
      expect(relPos.getPositions(hostElement)).toEqual({
        left: Math.round(8 + (967 - 967) / 2),
        top: Math.round(srcCoords.top - 18),
        width: 967,
        height: 'auto'
      });
    });
  });
  describe('on element position change', () => {
    let relPos;
    let eventBus;
    beforeEach(() => {
      relPos = new RelativePosition({ src: targetElement, autoUpdate: true });
      eventBus = new EventBus();
      relPos.setEventBus(eventBus);
    });

    it('should have eventBus', () => {
      expect(relPos.eventBus).toBeTruthy();
    });
    it('should emit proper event', done => {
      eventBus.watch().subscribe(res => {
        expect(res).toEqual({ name: 'NEW_DYN_POS', data: null });
        done();
      });
      targetElement.style.left = '0px';
    });
  });
  describe('should get correction position for', () => {
    const targetElCoords = {
      bottom: 76,
      height: 18,
      left: 8,
      right: 975,
      top: 58,
      width: 967
    };

    const hostElCoords = {
      width: 4, // actual 967
      height: 10 // actual 18
    };
    getData().forEach(data => {
      it(data.name, () => {
        const relPos = new RelativePosition({
          src: targetElement,
          hostWidth: hostElCoords.width,
          hostHeight: hostElCoords.height,
          placement: data.placement
        });
        const pos = relPos[data.method](targetElCoords, hostElCoords);
        expect(pos).toEqual(data.expected);
      });
    });
  });
});

function getData() {
  const tests = [
    {
      name: 'bottom',
      placement: OutsidePlacement.BOTTOM,
      method: `calculate_${OutsidePlacement.BOTTOM}`,
      expected: { left: 8 + (967 - 4) / 2, top: 76 }
    },
    {
      name: 'top',
      placement: OutsidePlacement.TOP,
      method: `calculate_${OutsidePlacement.TOP}`,
      expected: { left: 8 + (967 - 4) / 2, top: 48 }
    },
    {
      name: 'left',
      placement: OutsidePlacement.LEFT,
      method: `calculate_${OutsidePlacement.LEFT}`,
      expected: { left: 8 - 4, top: 58 + (18 - 10) / 2 }
    },
    {
      name: 'right',
      placement: OutsidePlacement.RIGHT,
      method: `calculate_${OutsidePlacement.RIGHT}`,
      expected: { left: 975, top: 58 + (18 - 10) / 2 }
    },
    {
      name: 'top left',
      placement: OutsidePlacement.TOP_LEFT,
      method: `calculate_${OutsidePlacement.TOP_LEFT}`,
      expected: { left: 8, top: 58 - 10 }
    },
    {
      name: 'top right',
      placement: OutsidePlacement.TOP_RIGHT,
      method: `calculate_${OutsidePlacement.TOP_RIGHT}`,
      expected: { left: 8 + (967 - 4), top: 58 - 10 }
    },
    {
      name: 'bottom left',
      placement: OutsidePlacement.BOTTOM_LEFT,
      method: `calculate_${OutsidePlacement.BOTTOM_LEFT}`,
      expected: { left: 8, top: 76 }
    },
    {
      name: 'bottom right',
      placement: OutsidePlacement.BOTTOM_RIGHT,
      method: `calculate_${OutsidePlacement.BOTTOM_RIGHT}`,
      expected: { left: 8 + (967 - 4), top: 76 }
    },
    {
      name: 'right top',
      placement: OutsidePlacement.RIGHT_TOP,
      method: `calculate_${OutsidePlacement.RIGHT_TOP}`,
      expected: { left: 975, top: 58 }
    },
    {
      name: 'right bottom',
      placement: OutsidePlacement.RIGHT_BOTTOM,
      method: `calculate_${OutsidePlacement.RIGHT_BOTTOM}`,
      expected: { left: 975, top: 76 - 10 }
    },
    {
      name: 'left top',
      placement: OutsidePlacement.LEFT_TOP,
      method: `calculate_${OutsidePlacement.LEFT_TOP}`,
      expected: { left: 8 - 4, top: 58 }
    },
    {
      name: 'left bottom',
      placement: OutsidePlacement.LEFT_BOTTOM,
      method: `calculate_${OutsidePlacement.LEFT_BOTTOM}`,
      expected: { left: 8 - 4, top: 76 - 10 }
    }
  ];

  return tests;
}
