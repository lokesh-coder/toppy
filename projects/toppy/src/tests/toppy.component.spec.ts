import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { skip, switchMap, take } from 'rxjs/operators';
import { DefaultConfig } from '../lib/config';
import { ContentType } from '../lib/models';
import { ToppyComponent } from '../lib/toppy.component';
import { Bus } from '../lib/utils';

@Component({
  selector: 'test-comp',
  template: 'Hello {{name||"John"}}'
})
export class TestComponent {
  @Input() data = null;
  @Output() fire: EventEmitter<any> = new EventEmitter();
  name;
}

@NgModule({
  declarations: [TestComponent],
  entryComponents: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {}

describe('@ ToppyComponent', () => {
  let fixture: ComponentFixture<ToppyComponent>;
  let debugEl: DebugElement;
  let toppyComp: ToppyComponent;
  let el: HTMLElement;
  let die: Subject<boolean>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [ToppyComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ToppyComponent);
    debugEl = fixture.debugElement;
    el = debugEl.nativeElement;
    toppyComp = fixture.componentInstance;
  }));

  beforeEach(() => {
    toppyComp.tid = 'abc';
    toppyComp.config = { ...DefaultConfig, bodyClass: 'zzz' };
    toppyComp.position = {
      getClassName: () => 'relative',
      getPositions: c => ({ left: 45, top: 79, extra: 't' })
    } as any;
    die = new Subject();
    Bus['_e'] = new Subject();
  });

  afterEach(() => {
    fixture.destroy();
    die.next(true);
    die.complete();
    Bus.stop();
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
      expect(el.classList.value).toBe('t-container t-overlay relative');
    });
    it('should add class for docClick', () => {
      toppyComp.config.closeOnDocClick = true;
      fixture.detectChanges();
      expect(el.classList.value).toBe('t-container t-overlay relative no-pointers');
    });
    it('should add class for bodyClass', () => {
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
      spyOn(toppyComp as any, 'setPos');
      Bus.send('abc', 't_dynpos', null);
      toppyComp.ngAfterViewInit();
      expect(toppyComp['setPos']).toHaveBeenCalled();
    });
    it('should subscribe to listenPos when custom data is arraived', () => {
      fixture.detectChanges();
      toppyComp.ngAfterViewInit();
      Bus.send('abc', 't_dynpos', { x: 10, y: 12 });
      expect(el.querySelector('.t-wrapper').getAttribute('style')).toEqual('left: 10px; top: 12px;');
    });
    it('should render custom props in the template', () => {
      toppyComp.content.data = TestComponent;
      toppyComp.content.type = ContentType.COMPONENT;
      toppyComp.content.props = {
        name: 'Peter',
        id: 22
      };
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('test-comp')).nativeElement.textContent).toBe('Hello Peter');
    });
    it('should emit host component instance', done => {
      toppyComp.content.data = TestComponent;
      toppyComp.content.type = ContentType.COMPONENT;
      toppyComp.content.props = {
        name: 'Loky'
      };
      fixture.detectChanges();
      Bus.listen('abc', 't_compins').subscribe(data => {
        expect(data.name).toEqual('Loky');
        done();
      });
      toppyComp.ngAfterViewInit();
    });
    it('should able to access "@Output()"', done => {
      toppyComp.content.data = TestComponent;
      toppyComp.content.type = ContentType.COMPONENT;
      toppyComp.content.props = { name: 'SSSS' };
      fixture.detectChanges();
      Bus.listen('abc', 't_compins')
        .pipe(switchMap(a => a['fire']))
        .subscribe(data => {
          expect(data).toEqual('ABCXYZ');
          done();
        });
      toppyComp.ngAfterViewInit();
      toppyComp.compInstance.fire.emit('ABCXYZ');
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
      toppyComp.config.bodyClass = 'Bunny';
      fixture.detectChanges();
      expect(document.querySelector('body').classList.value).toEqual('Bunny');
      fixture.destroy();
      expect(document.querySelector('body').classList.value).toEqual('');
    });
    it('should unsubscribe all events', () => {
      spyOn(toppyComp as any, 'setPos');
      toppyComp.ngAfterViewInit();
      Bus.send('abc', 't_dynpos');
      expect(toppyComp['setPos']).toHaveBeenCalledTimes(2);
      fixture.destroy();
      Bus.send('abc', 't_dynpos');
      expect(toppyComp['setPos']).toHaveBeenCalledTimes(2);
    });
    it('should fire t_detach event', () => {
      const spy = jasmine.createSpy().and.callThrough();
      Bus.listen('abc', 't_detach')
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
      Bus.send('abc', 't_dynpos', { x: 99, y: 22 });
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
    it('should set extra class to wrapper element', () => {
      fixture.detectChanges();
      toppyComp['setPos']();
      expect(el.querySelector('.t-wrapper').classList.value).toEqual('t-wrapper t');
    });
  });
});
