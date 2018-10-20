import { TestBed, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { Component, Injectable, NgModule, DebugElement } from '@angular/core';
import { DomHelper } from '../lib/helper/dom';
import { ToppyRef } from '../lib/toppy-ref';
import { OverlayInstance } from '../lib/overlay-instance';
import { HostContainer } from '../lib/host-container';
import { EventBus } from '../lib/helper/event-bus';
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
export class BlinkRefMock extends ToppyRef<any> {
  constructor(_overlay: OverlayInstance, _host: HostContainer<any>, _messenger: EventBus) {
    _overlay.configure(new GlobalPosition({ placement: InsidePlacement.CENTER }), '');
    _host.configure(TestComponent);
    super(_overlay, _host, _messenger, 'xyzabc');
  }
}

describe('== Blink ref ==', () => {
  let toppyRef: ToppyRef<any> = null;
  let debugEl: DebugElement = null;
  let fixture: ComponentFixture<TestComponent> = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        {
          provide: ToppyRef,
          useClass: BlinkRefMock
        },
        DomHelper,
        OverlayInstance,
        HostContainer,
        EventBus
      ]
    }).compileComponents();
    toppyRef = TestBed.get(ToppyRef);
    fixture = TestBed.createComponent(TestComponent);
    debugEl = fixture.debugElement;
  }));

  it('should initialize', () => {
    expect(toppyRef).toBeTruthy();
  });
  it('should increase the reference count', () => {
    expect(toppyRef.count).toEqual(1);
  });
  it('should fire a event', () => {
    toppyRef.events['overlay'].subscribe(e => {
      expect(e).toBe('init');
    });
  });

  describe('on calling `open` method', () => {
    afterEach(() => {
      toppyRef.close();
    });
    it('should return same instance', () => {
      toppyRef.id = 'QWERTY';
      const instance = toppyRef.open();
      expect(instance instanceof ToppyRef).toBeTruthy();
      expect(instance.id).toBe('QWERTY');
    });
    it('should get the component instance', () => {
      toppyRef.open();
      expect(toppyRef.compIns.component instanceof TestComponent).toBeTruthy();
      expect(toppyRef.compIns.component.name).toBe('test-component');
    });
    it('should create overlay element in DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('overlay-container');
      expect(overlayContainerElements.length).toEqual(0);
      toppyRef.open();
      expect(overlayContainerElements.length).toEqual(1);
    });
    it('should attach component element in DOM', () => {
      const componentElement = document.getElementsByTagName('test-component');
      toppyRef.open();
      expect(componentElement.length).toEqual(1);
    });
    it('should watch window resize', fakeAsync(() => {
      toppyRef.open();
      toppyRef.onWindowResize().subscribe(res => {
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
      toppyRef.open();
      expect(overlayContainerElements.length).toEqual(1);
      toppyRef.close();
      expect(overlayContainerElements.length).toEqual(0);
    });
    it('should remove all overlay container elements form DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('overlay-container');
      toppyRef.open();
      toppyRef.open();
      toppyRef.open();
      expect(overlayContainerElements.length).toEqual(1);
      toppyRef.close();
      expect(overlayContainerElements.length).toEqual(0);
    });
  });
});
