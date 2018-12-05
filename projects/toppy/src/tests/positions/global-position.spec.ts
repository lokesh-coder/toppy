/// <reference types="karma-viewport" />

import { InsidePlacement } from '../../lib/models';
import { GlobalPosition } from '../../lib/position';

describe('== Global position ==', () => {
  let targetElement: HTMLElement;
  let hostElement: HTMLElement;
  let ww;
  let wh;
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

    ww = window.innerWidth;
    wh = window.innerHeight;
  });
  afterEach(() => {
    document.getElementsByTagName('body')[0].removeChild(targetElement);
    document.getElementsByTagName('body')[0].removeChild(hostElement);
    viewport.set(1000, 480);
  });

  it('should have target element in document', () => {
    expect(document.querySelector('.foobar').textContent).toBe('Hello');
  });
  it('should get updated config', () => {
    const gloPos = new GlobalPosition({});
    gloPos.updateConfig({ offset: 2 });
    expect((gloPos as any)._config).toEqual({
      placement: InsidePlacement.CENTER,
      hostWidth: 100,
      hostHeight: 100,
      offset: 2
    });
  });
  it('should return correct class name', () => {
    const gloPos = new GlobalPosition({});
    expect(gloPos.getClassName()).toBe('global-position');
  });

  describe('should return correct position coords of host element', () => {
    let srcCoords;
    beforeEach(() => {
      srcCoords = targetElement.getBoundingClientRect();
    });
    it('when exact width and height is provided in px', () => {
      const gloPos = new GlobalPosition({
        hostWidth: 4,
        hostHeight: 10,
        placement: InsidePlacement.TOP
      });
      expect(gloPos.getPositions(hostElement)).toEqual({
        left: (ww - 4) / 2,
        top: 0,
        width: 4,
        height: 10,
        position: 'fixed'
      });
    });
    it('when exact width and height is provided in negative px', () => {
      const gloPos = new GlobalPosition({
        hostWidth: -4,
        hostHeight: -10,
        placement: InsidePlacement.TOP
      });
      expect(gloPos.getPositions(hostElement)).toEqual({
        left: (ww - 4) / 2,
        top: 0,
        width: 4,
        height: 10,
        position: 'fixed'
      });
    });
    it('when exact width and height is provided in percentage', () => {
      const gloPos = new GlobalPosition({
        hostWidth: '50%',
        hostHeight: '50%',
        placement: InsidePlacement.TOP
      });
      expect(gloPos.getPositions(hostElement)).toEqual({
        left: (ww - 967) / 2,
        top: 0,
        width: `calc(${ww}px - 50%)`,
        height: `calc(${wh}px - 50%)`,
        position: 'fixed'
      });
    });
    it('when exact width and height is provided in higher percentage', () => {
      const gloPos = new GlobalPosition({
        hostWidth: '150%',
        hostHeight: '150%',
        placement: InsidePlacement.TOP
      });
      expect(gloPos.getPositions(hostElement)).toEqual({
        left: (ww - 967) / 2,
        top: 0,
        width: `calc(${ww}px - 0%)`,
        height: `calc(${wh}px - 0%)`,
        position: 'fixed'
      });
    });
    it('when no width and height is provided', () => {
      const gloPos = new GlobalPosition({ placement: InsidePlacement.TOP_RIGHT });
      expect(gloPos.getPositions(hostElement)).toEqual({
        right: 0,
        top: 0,
        width: 100,
        height: 100,
        position: 'fixed'
      });
    });
  });
  describe('should get correction position for', () => {
    const targetElCoords = {
      width: (window as any).innerWidth,
      height: (window as any).innerHeight
    };

    const hostElCoords = {
      width: 4, // actual 967
      height: 10 // actual 18
    };
    getData().forEach(data => {
      it(data.name, () => {
        const gloPos = new GlobalPosition({
          hostWidth: hostElCoords.width,
          hostHeight: hostElCoords.height,
          placement: data.placement,
          offset: 2
        });
        const pos = (gloPos as any)._calc(data.placement, targetElCoords, hostElCoords);
        expect(pos).toEqual(data.expected);
      });
    });
  });
  function getData() {
    // offset is 2
    ww = window.innerWidth;
    wh = window.innerHeight;
    const tests = [
      {
        name: 'bottom',
        placement: InsidePlacement.BOTTOM,
        method: `calculate_${InsidePlacement.BOTTOM}`,
        expected: { left: (ww - 4) / 2, bottom: 2 }
      },
      {
        name: 'top',
        placement: InsidePlacement.TOP,
        method: `calculate_${InsidePlacement.TOP}`,
        expected: { left: (ww - 4) / 2, top: 2 }
      },
      {
        name: 'left',
        placement: InsidePlacement.LEFT,
        method: `calculate_${InsidePlacement.LEFT}`,
        expected: { left: 2, top: (wh - 10) / 2 }
      },
      {
        name: 'right',
        placement: InsidePlacement.RIGHT,
        method: `calculate_${InsidePlacement.RIGHT}`,
        expected: { right: 2, top: (wh - 10) / 2 }
      },
      {
        name: 'center',
        placement: InsidePlacement.CENTER,
        method: `calculate_${InsidePlacement.CENTER}`,
        expected: { left: (ww - 4) / 2, top: (wh - 10) / 2 }
      },
      {
        name: 'top left',
        placement: InsidePlacement.TOP_LEFT,
        method: `calculate_${InsidePlacement.TOP_LEFT}`,
        expected: { left: 2, top: 2 }
      },
      {
        name: 'top right',
        placement: InsidePlacement.TOP_RIGHT,
        method: `calculate_${InsidePlacement.TOP_RIGHT}`,
        expected: { right: 2, top: 2 }
      },
      {
        name: 'bottom left',
        placement: InsidePlacement.BOTTOM_LEFT,
        method: `calculate_${InsidePlacement.BOTTOM_LEFT}`,
        expected: { left: 2, bottom: 2 }
      },
      {
        name: 'bottom right',
        placement: InsidePlacement.BOTTOM_RIGHT,
        method: `calculate_${InsidePlacement.BOTTOM_RIGHT}`,
        expected: { right: 2, bottom: 2 }
      }
    ];

    return tests;
  }
});
