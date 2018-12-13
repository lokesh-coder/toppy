import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { skip, take } from 'rxjs/operators';
import { DefaultConfig } from '../lib/config';
import { CurrentOverlay } from '../lib/current-overlay';
import { ContentType } from '../lib/models';
import { ToppyComponent } from '../lib/toppy.component';
import { Bus } from '../lib/utils';

describe('== ToppyComponent ==', () => {
  let fixture: ComponentFixture<ToppyComponent>;
  let debugEl: DebugElement;
  let toppyComp: ToppyComponent;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToppyComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ToppyComponent);
    debugEl = fixture.debugElement;
    el = debugEl.nativeElement;
    toppyComp = fixture.componentInstance;
  }));

  beforeEach(() => {
    toppyComp.tid = 'abc';
    toppyComp.config = { ...DefaultConfig, bodyClassNameOnOpen: 'zzz' };
    toppyComp.position = { getClassName: () => 'relative', getPositions: c => ({ left: 45, top: 79 }) } as any;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be initialized', () => {
    expect(toppyComp).toBeTruthy();
  });
  describe('#ngOnInit', () => {
    it('should add data-tid attribute', () => {
      fixture.detectChanges();
      expect(el.getAttribute('data-tid')).toEqual('abc');
    });
    it('should add default classes', () => {
      fixture.detectChanges();
      expect(el.classList.value).toBe('t-container relative');
    });
    it('should add class for docClick', () => {
      toppyComp.config.dismissOnDocumentClick = true;
      fixture.detectChanges();
      expect(el.classList.value).toBe('t-container relative no-pointers');
    });
    it('should add class for bodyClassNameOnOpen', () => {
      fixture.detectChanges();
      expect(document.querySelector('body').classList.value).toEqual('zzz');
    });
  });

  describe('#ngAfterViewInit', () => {
    it('should call setPos', () => {
      fixture.detectChanges();
      spyOn(toppyComp as any, 'setPos');
      toppyComp.ngAfterViewInit();
      expect(toppyComp['setPos']).toHaveBeenCalled();
    });
    it('should subscribe to triggerPosChange', () => {
      spyOn(toppyComp as any, 'setPos');
      fixture.detectChanges();
      toppyComp.ngAfterViewInit();
      expect(toppyComp['setPos']).toHaveBeenCalled();
    });
    it('should subscribe to listenPos', () => {
      fixture.detectChanges();
      toppyComp.triggerPosChange.complete();
      spyOn(toppyComp as any, 'setPos');
      Bus.send('abc', 'NEW_DYN_POS', null);
      toppyComp.ngAfterViewInit();
      expect(toppyComp['setPos']).toHaveBeenCalled();
    });
    it('should subscribe to listenPos when custom data is arraived', () => {
      fixture.detectChanges();
      toppyComp.triggerPosChange.complete();
      toppyComp.ngAfterViewInit();
      Bus.send('abc', 'NEW_DYN_POS', { x: 10, y: 12 });
      expect(el.querySelector('.t-wrapper').getAttribute('style')).toEqual('left: 10px; top: 12px;');
    });
  });

  describe('#createInj', () => {
    it('should return new StaticInjector ', () => {
      expect(toppyComp.createInj().constructor.name).toEqual('StaticInjector');
    });
    it('should have CurrentOverlay', () => {
      expect(toppyComp.createInj().get(CurrentOverlay)).toBeTruthy();
      expect(toppyComp.createInj().get(CurrentOverlay).close).toBeTruthy();
    });
  });
  describe('#updateTextContent', () => {
    it('should not change the text if the content is not string', () => {
      toppyComp.content = {
        data: 'DUMMY',
        props: {},
        type: ContentType.HTML
      };
      const text = 'Little cute Dog';
      toppyComp.updateTextContent(text);
      fixture.detectChanges();
      expect(debugEl.query(By.css('.t-wrapper div')).nativeElement.textContent).toEqual('DUMMY');
    });
    it('should change the text content in template', () => {
      const text = 'Little cute Dog';
      toppyComp.updateTextContent(text);
      fixture.detectChanges();
      expect(debugEl.query(By.css('.t-wrapper div')).nativeElement.textContent).toEqual(text);
    });
  });

  describe('#ngOnDestroy', () => {
    it('should remove class name from body', () => {
      toppyComp.config.bodyClassNameOnOpen = 'Bunny';
      fixture.detectChanges();
      expect(document.querySelector('body').classList.value).toEqual('Bunny');
      fixture.destroy();
      expect(document.querySelector('body').classList.value).toEqual('');
    });
    it('should unsubscribe all events', () => {
      spyOn(toppyComp as any, 'setPos');
      toppyComp.ngAfterViewInit();
      toppyComp.triggerPosChange.next(1);
      Bus.send('abc', 'NEW_DYN_POS');
      expect(toppyComp['setPos']).toHaveBeenCalledTimes(3);
      fixture.destroy();
      toppyComp.triggerPosChange.next(1);
      Bus.send('abc', 'NEW_DYN_POS');
      expect(toppyComp['setPos']).toHaveBeenCalledTimes(3);
    });
    it('should fire DETACHED event', () => {
      const spy = jasmine.createSpy().and.callThrough();
      Bus.listen('abc', 'DETACHED')
        .pipe(take(1))
        .subscribe(() => {
          spy();
          spy();
        });
      fixture.destroy();
      expect(spy.calls.count()).toEqual(2);
    });
  });
  describe('#listenPos', () => {
    it('should return new position', done => {
      fixture.detectChanges();
      toppyComp['listenPos']().subscribe(data => {
        expect(data).toEqual(1);
        done();
      });
    });
    it('should add styles', done => {
      fixture.detectChanges();
      toppyComp['listenPos']()
        .pipe(take(1))
        .subscribe(() => {
          expect(el.querySelector('.t-wrapper').getAttribute('style')).toEqual(
            'left: 45px; top: 79px; visibility: visible; opacity: 1;'
          );
          done();
        });
    });
    it('should add styles', done => {
      fixture.detectChanges();
      toppyComp['listenPos']()
        .pipe(skip(1))
        .subscribe(() => {
          expect(el.querySelector('.t-wrapper').getAttribute('style')).toEqual('left: 99px; top: 22px;');
          done();
        });
      Bus.send('abc', 'NEW_DYN_POS', { x: 99, y: 22 });
    });
  });

  describe('#setPos', () => {
    it('should set positions to wrapper element', () => {
      fixture.detectChanges();
      toppyComp['setPos']();
      expect(el.querySelector('.t-wrapper').getAttribute('style')).toEqual(
        'left: 45px; top: 79px; visibility: visible; opacity: 1;'
      );
    });
    it('should emit position change event', () => {
      const spy = jasmine.createSpy().and.callThrough();
      fixture.detectChanges();
      Bus.listen('abc', 't_posupdate')
        .pipe(take(1))
        .subscribe(() => {
          spy();
          spy();
          spy();
        });
      toppyComp['setPos']();
      expect(spy.calls.count()).toEqual(3);
    });
  });
});