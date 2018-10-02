import { TestBed, async } from '@angular/core/testing';
import { Component, Injectable, NgModule } from '@angular/core';
import { DomHelper } from '../lib/helper/dom';
import { BlinkRef } from '../lib/blink-ref';
import { OverlayInstance } from '../lib/overlay-ins';
import { ComponentHost } from '../lib/host';
import { Messenger } from '../lib/helper/messenger';
import { GlobalPosition } from '../lib/position/global-position';
import { InsidePlacement } from '../lib/models';

@Component({
  template: `
    <div>DYNAMIC COMP</div>
  `
})
export class TestComponent {
  name = 'test-component';
}

@NgModule({
  declarations: [TestComponent],
  entryComponents: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {}

@Injectable()
export class BlinkRefMock extends BlinkRef<any> {
  constructor(_overlay: OverlayInstance, _host: ComponentHost<any>, _messenger: Messenger) {
    _overlay.configure(new GlobalPosition({ placement: InsidePlacement.CENTER }), '');
    _host.configure(TestComponent);
    super(_overlay, _host, _messenger, 'xyzabc');
  }
}

describe('Blink ref:', () => {
  let blinkRef: BlinkRef<any> = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        {
          provide: BlinkRef,
          useClass: BlinkRefMock
        },
        DomHelper,
        OverlayInstance,
        ComponentHost,
        Messenger
      ]
    }).compileComponents();
    blinkRef = TestBed.get(BlinkRef);
  }));

  it('should initialize', () => {
    expect(blinkRef).toBeTruthy();
  });
  it('should increase the reference count', () => {
    expect(blinkRef.count).toEqual(1);
  });
  it('should fire a event', () => {
    blinkRef.events['overlay'].subscribe(e => {
      expect(e).toBe('init');
    });
  });

  describe('on calling `open` method', () => {
    it('should return same instance', () => {
      blinkRef.id = 'QWERTY';
      let instance = blinkRef.open();
      expect(instance instanceof BlinkRef).toBeTruthy();
      expect(instance.id).toBe('QWERTY');
    });
    it('should get the component instance', () => {
      blinkRef.open();
      expect(blinkRef.compIns.component instanceof TestComponent).toBeTruthy();
      expect(blinkRef.compIns.component.name).toBe('test-component');
    });
    it("should attach a component's event", () => {
      // blinkRef.open();
    });
    it('should create overlay element in DOM', () => {});
    it('should attach component element in DOM', () => {});
    it('should watch window resize', () => {});
    it('should watch window resize', () => {});
  });
});
