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
}

@Component({
  template: 'Hi'
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent, TemplateRefTestComponent],
  // exports: [TemplateRefTestComponent, TestComponent],
  entryComponents: [TestComponent]
})
export class TemplateRefTestModule {}

describe('== Toppy ==', () => {
  let toppy: Toppy = null;
  let templateRefCompFixture: ComponentFixture<TemplateRefTestComponent>;
  let templateRefComp: TemplateRefTestComponent;
  let appRef, compFact, inj;
  const config = DefaultConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TemplateRefTestModule],
      declarations: [],
      providers: [Toppy, ApplicationRef, ComponentFactoryResolver, Injector]
    }).compileComponents();

    templateRefCompFixture = TestBed.createComponent(TemplateRefTestComponent);
    templateRefComp = templateRefCompFixture.componentInstance;
    toppy = TestBed.get(Toppy);
    appRef = TestBed.get(ApplicationRef);
    compFact = TestBed.get(ComponentFactoryResolver);
    inj = TestBed.get(Injector);
  }));

  afterEach(function() {
    templateRefCompFixture.destroy();
    document.querySelector('body').removeChild(templateRefCompFixture.debugElement.nativeElement);
    // _off();
  });

  it('should be initialized', () => {
    expect(toppy).toBeTruthy();
  });

  describe('with default settings', () => {
    let ctrl: ToppyControl;
    beforeEach(() => {
      ctrl = toppy.create();
    });
    afterEach(() => {
      toppy.ngOnDestroy();
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
      const tid = (toppy as any)._tid;
      expect(ctrl.content).toEqual({ data: 'hello', type: ContentType.STRING, props: { id: tid } });
    });
    it('should add control to toppy', () => {
      expect(Object.keys(Toppy.controls).length).toEqual(1);
    });
  });
  describe('with provided settings', () => {
    let ctrl: ToppyControl;
    let tid: string;
    beforeEach(() => {
      ctrl = toppy
        .position(new RelativePosition({ src: templateRefComp.el.nativeElement }))
        .config({ backdropClass: 't-custom-backdrop' })
        .content('random text')
        .create();
      tid = (toppy as any)._tid;
    });
    afterEach(() => {
      toppy.ngOnDestroy();
    });
    it('should set custom config in "Toppy"', () => {
      expect((toppy as any)._inputs.config).toEqual({ ...DefaultConfig, backdropClass: 't-custom-backdrop' });
    });
    it('should set custom config in "ToppyControl"', () => {
      expect(toppy.getCtrl(tid).config).toEqual({ ...DefaultConfig, backdropClass: 't-custom-backdrop' });
    });
    it('should set custom position in "Toppy"', () => {
      expect((toppy as any)._inputs.position instanceof RelativePosition).toBeTruthy();
    });
    it('should set custom position in "ToppyControl"', () => {
      expect(toppy.getCtrl(tid).position instanceof RelativePosition).toBeTruthy();
    });
    it('should set custom content in "Toppy"', () => {
      expect((toppy as any)._inputs.content).toEqual({
        type: ContentType.STRING,
        data: 'random text',
        props: { id: tid }
      });
    });
    it('should set custom content in "ToppyControl"', () => {
      expect(toppy.getCtrl(tid).content).toEqual({ type: ContentType.STRING, data: 'random text', props: { id: tid } });
    });
  });
  describe('with different content type', () => {
    let t: Toppy;
    let tid: string;
    beforeEach(() => {
      t = toppy
        .position(new RelativePosition({ src: templateRefComp.el.nativeElement }))
        .config({ backdropClass: 't-custom-backdrop' });
    });
    afterEach(() => {
      toppy.ngOnDestroy();
    });
    /* string */
    it('text content without props', () => {
      t.content('hello').create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({ type: ContentType.STRING, data: 'hello', props: { id: tid } });
    });
    it('text content with props', () => {
      t.content('hello', { class: 'abc' }).create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({
        type: ContentType.STRING,
        data: 'hello',
        props: { id: tid, class: 'abc' }
      });
    });

    /* html */
    it('html content without props', () => {
      t.content('<span>hello</span>').create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({
        type: ContentType.STRING,
        data: '<span>hello</span>',
        props: { id: tid }
      });
    });
    it('html content with props', () => {
      t.content('<span>hello</span>', { hasHTML: true }).create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({
        type: ContentType.HTML,
        data: '<span>hello</span>',
        props: { id: tid, hasHTML: true }
      });
    });

    /* template */
    it('template content without props', () => {
      t.content(templateRefComp.tpl).create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({
        type: ContentType.TEMPLATE,
        data: templateRefComp.tpl,
        props: { id: tid }
      });
    });
    it('template content with props', () => {
      t.content(templateRefComp.tpl, { name: 'Johny' }).create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({
        type: ContentType.TEMPLATE,
        data: templateRefComp.tpl,
        props: { id: tid, name: 'Johny' }
      });
    });

    /* component */
    it('component content without props', () => {
      t.content(TestComponent).create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({
        type: ContentType.COMPONENT,
        data: TestComponent,
        props: { id: tid }
      });
    });
    it('component content with props', () => {
      t.content(TestComponent, { name: 'Johny' }).create();
      tid = (toppy as any)._tid;
      expect(toppy.getCtrl(tid).content).toEqual({
        type: ContentType.COMPONENT,
        data: TestComponent,
        props: { id: tid, name: 'Johny' }
      });
    });
  });

  describe('when "create" method is called', () => {
    let ctrl1: ToppyControl;
    let t: Toppy;
    let firstTid, secondTid;
    beforeEach(() => {
      ctrl1 = toppy.create();
      firstTid = (toppy as any)._tid;

      t = toppy.content('abc');
      (t as any).tid = firstTid;
      t.create();
      secondTid = (toppy as any)._tid;
    });
    afterEach(() => {
      toppy.ngOnDestroy();
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
});
