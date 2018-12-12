import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, ComponentFactoryResolver, DebugElement, Injector, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { take, takeUntil } from 'rxjs/operators';
import { DefaultConfig } from 'toppy/lib/config';
import { ContentType, InsidePlacement } from 'toppy/lib/models';
import { Bus } from 'toppy/lib/utils';
import { GlobalPosition } from '../lib/position';
import { ToppyControl } from '../lib/toppy-control';
import { ToppyComponent } from '../lib/toppy.component';
import { merge, of, Subject } from 'rxjs';

@Component({
  selector: 'lib-test-component',
  template: '<div>DYNAMIC COMP</div>'
})
export class TestComponent {
  name = 'lib-test-component';
}

@NgModule({
  imports: [CommonModule],
  declarations: [TestComponent, ToppyComponent],
  entryComponents: [TestComponent, ToppyComponent],
  exports: [TestComponent, ToppyComponent]
})
export class TestModule {}

describe('== ToppyControl ==', () => {
  let toppyControl: ToppyControl = null;
  let debugEl: DebugElement = null;
  let fixture: ComponentFixture<TestComponent> = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule, CommonModule],
      providers: [
        { provide: ToppyControl, useClass: ToppyControl, deps: [ApplicationRef, ComponentFactoryResolver, Injector] }
      ]
    }).compileComponents();

    toppyControl = TestBed.get(ToppyControl);
    fixture = TestBed.createComponent(TestComponent);
    debugEl = fixture.debugElement;
  }));

  afterEach(function() {
    fixture.destroy();
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  it('should initialize', () => {
    expect(toppyControl).toBeTruthy();
  });
  describe('#open', () => {
    beforeEach(() => {
      toppyControl.tid = 'abc';
      toppyControl.config = DefaultConfig;
      toppyControl.content = { data: 'hello', props: { id: 'abc' }, type: ContentType.STRING };
    });
    afterEach(() => {
      toppyControl.close();
    });
    it('should return nothing if isOpen is true', () => {
      spyOn(toppyControl as any, '_attach').and.callThrough();
      toppyControl.open();
      toppyControl.open();
      toppyControl.open();
      expect(toppyControl['_attach']).toHaveBeenCalledTimes(1);
    });
    it('should set isOpen to true', () => {
      toppyControl.open();
      expect(toppyControl['isOpen']).toBeTruthy();
    });
    it('should emit event', done => {
      Bus.listen('abc', 'OPENED_OVERLAY_INS')
        .pipe(take(1))
        .subscribe(data => {
          expect(data).toEqual(null);
          done();
        });
      toppyControl.open();
    });
    it('should subscribe to "onDocumentClick"', () => {
      toppyControl.content = { data: 'hello', props: {}, type: ContentType.STRING };
      toppyControl.config = { ...DefaultConfig, dismissOnDocumentClick: true };
      toppyControl.position = new GlobalPosition({ placement: InsidePlacement.TOP });
      toppyControl.open();
      fixture.autoDetectChanges();
      const el: any = document.querySelector(`.${toppyControl.config.containerClass}`);
      el.click();
      expect(toppyControl['isOpen']).toBeFalsy();
    });
    it('should subscribe to "onEscClick"', () => {
      toppyControl.content = { data: 'hello', props: {}, type: ContentType.STRING };
      toppyControl.config = { ...DefaultConfig, closeOnEsc: true };
      toppyControl.position = new GlobalPosition({ placement: InsidePlacement.TOP });
      toppyControl.open();
      fixture.autoDetectChanges();
      document.querySelector('body').dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
      expect(toppyControl['isOpen']).toBeFalsy();
    });
    it('should subscribe to "onWindowResize"', (done) => {

      const spy = jasmine.createSpy('foobar').and.callFake(() => {});
      toppyControl.content = { data: 'hello', props: {}, type: ContentType.STRING };
      toppyControl.config = {...DefaultConfig, windowResizeCallback: () => {
        spy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      }};
      toppyControl.position = new GlobalPosition({ placement: InsidePlacement.TOP });
      toppyControl.open();

      fixture.autoDetectChanges();
      window.dispatchEvent(new Event('resize'));

    });
  });
  describe('#close', () => {
    beforeEach(() => {
      toppyControl.tid = 'abc';
      toppyControl.config = DefaultConfig;
      toppyControl.content = { data: 'hello', props: { id: 'abc' }, type: ContentType.STRING };
      toppyControl.position = new GlobalPosition({ placement: InsidePlacement.TOP });
    });
    afterEach(() => {
      toppyControl.close();
    });
    it('should remove element from DOM', () => {
      toppyControl.open();
      expect(document.querySelectorAll('toppy').length).toEqual(1);
      toppyControl.close();
      expect(document.querySelectorAll('toppy').length).toEqual(0);
    });
    it('should unsubscribe all events', () => {
      const sub = new Subject();
      const spy = jasmine.createSpy('spy').and.callThrough();
      sub.pipe(takeUntil(toppyControl['die'])).subscribe(_ =>  spy());
      toppyControl.open();
      sub.next(1);
      toppyControl.close();
      sub.next(1);
      expect(spy.calls.count()).toEqual(1);
    });
    it('should emit close event', (done) => {
      const spy = jasmine.createSpy('spy').and.callThrough();
      Bus.listen('abc', 'REMOVED_OVERLAY_INS').subscribe(_ => {
        spy();
        done();
      });
      toppyControl.close();
      expect(spy.calls.count()).toEqual(1);
    });
    it('should set isOpen to false', () => {
      toppyControl['isOpen'] = true;
      toppyControl.close();
      expect(toppyControl['isOpen']).toBeFalsy();
    });
  });
  describe('#constructor', () => {
    beforeEach(() => {
      toppyControl.tid = 'abc';
      toppyControl.config = DefaultConfig;
      toppyControl.content = { data: 'hello', props: { id: 'abc' }, type: ContentType.STRING };
      toppyControl.position = new GlobalPosition({ placement: InsidePlacement.TOP });
    });
    afterEach(() => {
      toppyControl.close();
    });
    it('should subscribe updateTextContent', () => {
      toppyControl.open();
      fixture.detectChanges();
      spyOn(toppyControl.comp, 'updateTextContent');
      toppyControl.updateTextContent.next('hello');
      expect(toppyControl.comp.updateTextContent).toHaveBeenCalledTimes(1);
    });
  });
  describe('#toggle', () => {
    beforeEach(() => {
      spyOn(toppyControl, 'open').and.callFake(() => {});
      spyOn(toppyControl, 'close').and.callFake(() => {});
    });
    afterEach(() => {
      toppyControl.close();
    });
    it('should call open when isOpen is false', () => {
      toppyControl['isOpen'] = false;
      toppyControl.toggle();
      expect(toppyControl.open).toHaveBeenCalledTimes(1);
      expect(toppyControl.close).toHaveBeenCalledTimes(0);
    });
    it('should call close when isOpen is true', () => {
      toppyControl['isOpen'] = true;
      toppyControl.toggle();
      expect(toppyControl.open).toHaveBeenCalledTimes(0);
      expect(toppyControl.close).toHaveBeenCalledTimes(1);
    });
  });
});
