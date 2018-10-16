import { TestBed, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { Component, Injectable, NgModule, DebugElement } from '@angular/core';
import { DomHelper } from '../lib/helper/dom';
import { BlinkRef } from '../lib/blink-ref';
import { OverlayInstance } from '../lib/overlay-instance';
import { HostContainer } from '../lib/host-container';
import { Messenger } from '../lib/helper/messenger';
import { GlobalPosition } from '../lib/position/global-position';
import { InsidePlacement } from '../lib/models';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'test-component',
  template: '<div>DYNAMIC COMP</div>'
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
  constructor(_overlay: OverlayInstance, _host: HostContainer<any>, _messenger: Messenger) {
    _overlay.configure(new GlobalPosition({ placement: InsidePlacement.CENTER }), '');
    _host.configure(TestComponent);
    super(_overlay, _host, _messenger, 'xyzabc');
  }
}

describe('== Blink ref ==', () => {
  let blinkRef: BlinkRef<any> = null;
  let debugEl: DebugElement = null;
  let fixture: ComponentFixture<TestComponent> = null;

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
        HostContainer,
        Messenger
      ]
    }).compileComponents();
    blinkRef = TestBed.get(BlinkRef);
    fixture = TestBed.createComponent(TestComponent);
    debugEl = fixture.debugElement;
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
    afterEach(() => {
      blinkRef.close();
    });
    it('should return same instance', () => {
      blinkRef.id = 'QWERTY';
      const instance = blinkRef.open();
      expect(instance instanceof BlinkRef).toBeTruthy();
      expect(instance.id).toBe('QWERTY');
    });
    it('should get the component instance', () => {
      blinkRef.open();
      expect(blinkRef.compIns.component instanceof TestComponent).toBeTruthy();
      expect(blinkRef.compIns.component.name).toBe('test-component');
    });
    it('should create overlay element in DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('overlay-container');
      expect(overlayContainerElements.length).toEqual(0);
      blinkRef.open();
      expect(overlayContainerElements.length).toEqual(1);
    });
    it('should attach component element in DOM', () => {
      const componentElement = document.getElementsByTagName('test-component');
      blinkRef.open();
      expect(componentElement.length).toEqual(1);
    });
    it('should watch window resize', fakeAsync(() => {
      blinkRef.open();
      blinkRef.onWindowResize().subscribe(res => {
        expect(res instanceof Event).toBeTruthy();
      });
      window.dispatchEvent(new Event('resize'));
      tick(10000);
      fixture.detectChanges();
    }));
  });

  describe('on calling `close` method', () => {
    it('should remove overlay container element form DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('overlay-container');
      expect(overlayContainerElements.length).toEqual(0);
      blinkRef.open();
      expect(overlayContainerElements.length).toEqual(1);
      blinkRef.close();
      expect(overlayContainerElements.length).toEqual(0);
    });
    it('should remove all overlay container elements form DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('overlay-container');
      blinkRef.open();
      blinkRef.open();
      blinkRef.open();
      expect(overlayContainerElements.length).toEqual(1);
      blinkRef.close();
      expect(overlayContainerElements.length).toEqual(0);
    });
  });
});
