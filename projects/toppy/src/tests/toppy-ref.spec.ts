import { Component, DebugElement, Injectable, NgModule } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { DefaultConfig } from 'toppy/lib/config';
import { DomHelper } from '../lib/helper/dom';
import { EventBus } from '../lib/helper/event-bus';
import { HostContainer } from '../lib/host-container';
import { InsidePlacement } from '../lib/models';
import { OverlayInstance } from '../lib/overlay-instance';
import { GlobalPosition } from '../lib/position/global-position';
import { ToppyRef } from '../lib/toppy-ref';

@Component({
  selector: 'lib-test-component',
  template: '<div>DYNAMIC COMP</div>'
})
export class TestComponent {
  name = 'lib-test-component';
}

@NgModule({
  declarations: [TestComponent],
  entryComponents: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {}

@Injectable()
export class ToppyRefMock extends ToppyRef {
  constructor(_overlay: OverlayInstance, _host: HostContainer, _messenger: EventBus) {
    _overlay.setConfig({ ...DefaultConfig, closeOnEsc: true });
    _overlay.configure(new GlobalPosition({ placement: InsidePlacement.CENTER }), '');
    _host.configure({ content: TestComponent, contentType: 'COMPONENT', props: {} });
    super(_overlay, _host, _messenger, { ...DefaultConfig, closeOnEsc: true }, 'xyzabc');
  }
}

describe('== Toppy ref ==', () => {
  let toppyRef: ToppyRef = null;
  let debugEl: DebugElement = null;
  let fixture: ComponentFixture<TestComponent> = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        {
          provide: ToppyRef,
          useClass: ToppyRefMock
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

  afterEach(function() {
    fixture.destroy();
    document.body.removeChild(fixture.debugElement.nativeElement);
  });


  it('should initialize', () => {
    expect(toppyRef).toBeTruthy();
  });
  it('should return event bus on calling "events" method', done => {
    toppyRef
      .events()
      .pipe(take(1))
      .subscribe(res => {
        expect(res).toEqual({ name: 'TEST', data: 'HELLO' });
        done();
      });
    (toppyRef as any)._eventBus.post({ name: 'TEST', data: 'HELLO' });
  });
  it('should return config on calling "getConfig" method', () => {
    expect(toppyRef.getConfig()).toEqual({ ...DefaultConfig, closeOnEsc: true });
  });
  it('should toggle on calling "toggle" method', () => {
    expect((toppyRef as any)._isOpen).toBeFalsy();
    toppyRef.toggle();
    expect((toppyRef as any)._isOpen).toBeTruthy();
    toppyRef.toggle();
    expect((toppyRef as any)._isOpen).toBeFalsy();
    toppyRef.close();
  });

  describe('on calling "open" method', () => {
    afterEach(() => {
      toppyRef.close();
    });
    it('should return same instance', () => {
      toppyRef.overlayID = 'QWERTY';
      const instance = toppyRef.open();
      expect(instance instanceof ToppyRef).toBeTruthy();
      expect(instance.overlayID).toBe('QWERTY');
    });
    // it('should get the component instance', () => {
    //   toppyRef.open();
    //   expect(toppyRef.compIns.component instanceof TestComponent).toBeTruthy();
    //   expect(toppyRef.compIns.component.name).toBe('lib-test-component');
    // });
    it('should create overlay element in DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('toppy-container');
      expect(overlayContainerElements.length).toEqual(0);
      toppyRef.open();
      expect(overlayContainerElements.length).toEqual(1);
    });
    it('should attach component element in DOM', () => {
      const componentElement = document.getElementsByTagName('lib-test-component');
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

  describe('on calling "close" method', () => {
    it('should remove overlay container element form DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('toppy-container');
      expect(overlayContainerElements.length).toEqual(0);
      toppyRef.open();
      expect(overlayContainerElements.length).toEqual(1);
      toppyRef.close();
      expect(overlayContainerElements.length).toEqual(0);
    });
    it('should remove all overlay container elements form DOM', () => {
      const overlayContainerElements = document.getElementsByClassName('toppy-container');
      toppyRef.open();
      toppyRef.open();
      toppyRef.open();
      expect(overlayContainerElements.length).toEqual(1);
      toppyRef.close();
      expect(overlayContainerElements.length).toEqual(0);
    });
  });

  describe('on documentClick event', () => {
    it('should return target element', done => {
      const spy = spyOn(toppyRef as any, '_cleanup').and.callFake(() => {
        return false;
      });
      (toppyRef as any)._listenDocumentEvents = false;
      toppyRef.open();
      toppyRef.onDocumentClick().subscribe(res => {
        expect(res.className).toBe('toppy-container global-position');
        done();
      });
      const el: any = document.querySelector('.toppy-container');
      el.click();
    });
  });

  describe('on calling "updateHost" method', () => {
    afterEach(() => {
      toppyRef.close();
    });
    it('should update content', () => {
      const overlayContainerElements = document.getElementsByClassName('toppy-container');
      toppyRef.overlayID = 'QWERTY';
      toppyRef.updateHost('new content');
      toppyRef.open();
      const content = overlayContainerElements[0].querySelector('.toppy-wrapper').textContent;
      expect(content).toBe('new content');
    });
  });

  describe('on calling "updatePosition" method', () => {
    afterEach(() => {
      toppyRef.close();
    });
    it('should update content', () => {
      const overlayContainerElements = document.getElementsByClassName('toppy-container');
      toppyRef.overlayID = 'QWERTY';
      const placement = (toppyRef as any)._overlay._position._config.placement;
      expect(placement).toEqual(InsidePlacement.CENTER);
      toppyRef.updatePosition({ placement: InsidePlacement.TOP_LEFT });
      const newplacement = (toppyRef as any)._overlay._position._config.placement;
      expect(newplacement).toEqual(InsidePlacement.TOP_LEFT);
    });
  });

  describe('on calling "onEscClick" method', () => {
    afterEach(() => {
      toppyRef.close();
    });
    it('should update content', () => {
      const overlayContainerElements = document.getElementsByClassName('toppy-container');
      toppyRef.overlayID = 'QWERTY';
      toppyRef.open();
      expect(overlayContainerElements.length).toEqual(1);
      document.getElementsByTagName('body')[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(overlayContainerElements.length).toEqual(0);
    });
  });
});
