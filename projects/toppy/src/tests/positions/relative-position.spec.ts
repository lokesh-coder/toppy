/// <reference types="karma-viewport" />

import { EventBus } from '../../lib/helper/event-bus';
import { OutsidePlacement } from '../../lib/models';
import { RelativePosition } from '../../lib/position';
console.log({ viewport });

describe('== Relative position ==', () => {
  let targetElement: HTMLElement;
  let hostElement: HTMLElement;
  beforeAll(() => {
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
  describe('should get correction position', () => {
    const targetElCoords = {
      bottom: 76,
      height: 18,
      left: 8,
      right: 975,
      top: 58,
      width: 967
    };

    const hostElCoords = {
      width: 4,
      height: 10
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
      method: 'calculateBottom',
      expected: { left: 8 + (967 - 4) / 2, top: 76 }
    },
    {
      name: 'top',
      placement: OutsidePlacement.TOP,
      method: 'calculateTop',
      expected: { left: 8 + (967 - 4) / 2, top: 48 }
    },
    {
      name: 'left',
      placement: OutsidePlacement.LEFT,
      method: 'calculateLeft',
      expected: { left: 8 - 4, top: 58 + (18 - 10) / 2 }
    },
    {
      name: 'right',
      placement: OutsidePlacement.RIGHT,
      method: 'calculateRight',
      expected: { left: 975, top: 58 + (18 - 10) / 2 }
    },
    {
      name: 'top left',
      placement: OutsidePlacement.TOP_LEFT,
      method: 'calculateTopLeft',
      expected: { left: 8, top: 58 - 10 }
    },
    {
      name: 'top right',
      placement: OutsidePlacement.TOP_RIGHT,
      method: 'calculateTopRight',
      expected: { left: 8 + (967 - 4), top: 58 - 10 }
    },
    {
      name: 'bottom left',
      placement: OutsidePlacement.BOTTOM_LEFT,
      method: 'calculateBottomLeft',
      expected: { left: 8, top: 76 }
    },
    {
      name: 'bottom right',
      placement: OutsidePlacement.BOTTOM_RIGHT,
      method: 'calculateBottomRight',
      expected: { left: 8 + (967 - 4), top: 76 }
    },
    {
      name: 'right top',
      placement: OutsidePlacement.RIGHT_TOP,
      method: 'calculateRightTop',
      expected: { left: 975, top: 58 }
    },
    {
      name: 'right bottom',
      placement: OutsidePlacement.RIGHT_BOTTOM,
      method: 'calculateRightBottom',
      expected: { left: 975, top: 76 - 10 }
    },
    {
      name: 'left top',
      placement: OutsidePlacement.LEFT_TOP,
      method: 'calculateLeftTop',
      expected: { left: 8 - 4, top: 58 }
    },
    {
      name: 'left bottom',
      placement: OutsidePlacement.LEFT_BOTTOM,
      method: 'calculateLeftBottom',
      expected: { left: 8 - 4, top: 76 - 10 }
    }
  ];

  return tests;
}
