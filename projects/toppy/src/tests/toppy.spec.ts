import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  NgModule,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultConfig } from '../lib/config';
import { ContentType } from '../lib/models';
import { GlobalPosition, RelativePosition } from '../lib/position';
import { Toppy } from '../lib/toppy';
import { ToppyControl } from '../lib/toppy-control';

@Component({
  selector: 'lib-template-ref-test-comp',
  template: `
    <span #el>some content</span>
    <ng-template #tpl>I am template</ng-template>
  `
})
export class TemplateRefTestComponent {
  @ViewChild('el', { read: ElementRef }) el: ElementRef;
  @ViewChild('tpl', { read: TemplateRef }) tpl;
  constructor(private toppy: Toppy) {}
}

@Component({
  template: 'Hi'
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent, TemplateRefTestComponent],
  entryComponents: [TestComponent]
})
export class TemplateRefTestModule {}

describe('@ Toppy', () => {
  let toppy: Toppy = null;
  let templateRefCompFixture: ComponentFixture<TemplateRefTestComponent>;
  let templateRefComp: TemplateRefTestComponent;
  let appRef, compFact, inj;
  const config = DefaultConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TemplateRefTestModule],
      declarations: [],
      providers: [ApplicationRef, ComponentFactoryResolver, Injector]
    }).compileComponents();

    templateRefCompFixture = TestBed.createComponent(TemplateRefTestComponent);
    templateRefComp = templateRefCompFixture.componentInstance;
    toppy = TestBed.get(Toppy);
    appRef = TestBed.get(ApplicationRef);
    compFact = TestBed.get(ComponentFactoryResolver);
    inj = TestBed.get(Injector);
    spyOn(toppy, 'destroy').and.callFake(() => {
      // tslint:disable-next-line:forin
      for (const key in Toppy.controls) {
        Toppy.controls[key].close();
      }
      Toppy.controls = {};
    });
  }));

  afterEach(function() {
    templateRefCompFixture.destroy();
    document.querySelector('body').removeChild(templateRefCompFixture.debugElement.nativeElement);
  });

  it('should be initialized', () => {
    expect(toppy).toBeTruthy();
  });

  describe('#basic', () => {
    let ctrl: ToppyControl;
    beforeEach(() => {
      ctrl = toppy.create();
    });
    afterEach(() => {
      toppy.destroy();
    });
    it('should return "ToppyControl"', () => {
      expect(ctrl instanceof ToppyControl).toBeTruthy();
    });
    it('should have default "GlobalPosition"', () => {
      expect(ctrl.position instanceof GlobalPosition).toBeTruthy();
    });
    it('should have default config', () => {
      expect(ctrl.config).toEqual(DefaultConfig);
    });
    it('should have default text content', () => {
      expect(ctrl.content).toEqual({ data: 'hello', type: ContentType.STRING, props: {} });
    });
    it('should add control to toppy', () => {
      expect(Object.keys(Toppy.controls).length).toEqual(1);
    });
  });
  describe('#config|#position|#content', () => {
    let ctrl: ToppyControl;
    let tid: string;
    beforeEach(() => {
      ctrl = toppy
        .position(new RelativePosition({ src: templateRefComp.el.nativeElement }))
        .config({ backdropClass: 't-custom-backdrop' })
        .content('random text')
        .create();
      tid = toppy['tid'];
    });
    afterEach(() => {
      toppy.destroy();
    });
    it('should set custom config in "Toppy"', () => {
      expect((toppy as any).inputs.config).toEqual({ ...DefaultConfig, backdropClass: 't-custom-backdrop' });
    });
    it('should set custom config in "ToppyControl"', () => {
      expect(toppy.getCtrl(tid).config).toEqual({ ...DefaultConfig, backdropClass: 't-custom-backdrop' });
    });
    it('should set custom position in "Toppy"', () => {
      expect((toppy as any).inputs.position instanceof RelativePosition).toBeTruthy();
    });
    it('should set custom position in "ToppyControl"', () => {
      expect(toppy.getCtrl(tid).position instanceof RelativePosition).toBeTruthy();
    });
    it('should set custom content in "Toppy"', () => {
      expect((toppy as any).inputs.content).toEqual({
        type: ContentType.STRING,
        data: 'random text',
        props: {}
      });
    });
    it('should set custom content in "ToppyControl"', () => {
      expect(toppy.getCtrl(tid).content).toEqual({ type: ContentType.STRING, data: 'random text', props: {} });
    });
  });
  describe('#content', () => {
    let t: Toppy;
    let tid: string;
    beforeEach(() => {
      t = toppy
        .position(new RelativePosition({ src: templateRefComp.el.nativeElement }))
        .config({ backdropClass: 't-custom-backdrop' });
    });
    afterEach(() => {
      toppy.destroy();
    });
    describe('should return content type as STRING', () => {
      it('when without props', () => {
        t.content('hello').create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({ type: ContentType.STRING, data: 'hello', props: {} });
      });
      it('when with props', () => {
        t.content('hello', { class: 'abc' }).create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({
          type: ContentType.STRING,
          data: 'hello',
          props: { class: 'abc' }
        });
      });
    });
    describe('should return content type as HTML', () => {
      it('when without props', () => {
        t.content('<span>hello</span>').create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({
          type: ContentType.STRING,
          data: '<span>hello</span>',
          props: {}
        });
      });
      it('when with props', () => {
        t.content('<span>hello</span>', { hasHTML: true }).create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({
          type: ContentType.HTML,
          data: '<span>hello</span>',
          props: { hasHTML: true }
        });
      });
    });
    describe('should return content type as TEMPLATE', () => {
      it('when without props', () => {
        t.content(templateRefComp.tpl).create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({
          type: ContentType.TEMPLATE,
          data: templateRefComp.tpl,
          props: {}
        });
      });
      it('when with props', () => {
        t.content(templateRefComp.tpl, { name: 'Johny' }).create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({
          type: ContentType.TEMPLATE,
          data: templateRefComp.tpl,
          props: { name: 'Johny' }
        });
      });
    });
    describe('should return content type as COMPONENT', () => {
      it('when without props', () => {
        t.content(TestComponent).create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({
          type: ContentType.COMPONENT,
          data: TestComponent,
          props: {}
        });
      });
      it('when with props', () => {
        t.content(TestComponent, { name: 'Johny' }).create();
        tid = toppy['tid'];
        expect(toppy.getCtrl(tid).content).toEqual({
          type: ContentType.COMPONENT,
          data: TestComponent,
          props: { name: 'Johny' }
        });
      });
    });
  });
  describe('#create', () => {
    let ctrl1: ToppyControl;
    let t: Toppy;
    let firstTid, secondTid;
    beforeEach(() => {
      ctrl1 = toppy.create();
      firstTid = toppy['tid'];

      t = toppy.content('abc');
      (t as any).tid = firstTid;
      t.create();
      secondTid = toppy['tid'];
    });
    afterEach(() => {
      toppy.destroy();
    });
    it('should create new instance if the tid already exists', () => {
      expect(Object.keys(Toppy.controls)).toEqual([firstTid, secondTid]);
    });
    it('should add multiple new instances', () => {
      toppy.create();
      toppy.create();
      toppy.create();
      expect(Object.keys(Toppy.controls).length).toEqual(5);
    });
  });
  describe('#destroy', () => {
    it('should remove all controls', () => {
      toppy.create();
      toppy.create();
      toppy.create();
      toppy.create();

      toppy.destroy();
      expect(Object.keys(Toppy.controls).length).toEqual(0);
    });
  });
});
