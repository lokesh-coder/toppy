import { Component, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { async, fakeAsync, TestBed } from '@angular/core/testing';
import { DefaultConfig } from '../lib/config';
import { EventBus } from '../lib/helper/event-bus';
import { HostContainer } from '../lib/host-container';
import { OverlayInstance } from '../lib/overlay-instance';
import { Toppy } from '../lib/toppy';
import { ToppyRef } from '../lib/toppy-ref';

@Component({
  selector: 'lib-template-ref-test-comp',
  template: `
    <span>some content</span>
    <ng-template #tpl>I am template</ng-template>
  `
})
export class TemplateRefTestComponent {
  @ViewChild('tpl', { read: TemplateRef }) tpl;
}

@Component({
  template: 'Hi'
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent, TemplateRefTestComponent],
  exports: [TemplateRefTestComponent, TestComponent],
  entryComponents: [TestComponent]
})
export class TemplateRefTestModule {}

describe('== Toppy ==', () => {
  let toppy: Toppy = null;
  let overlaySpy;
  let overlayMock;
  let componentHostSpy;
  let componentHostMock;
  let utilsMock;
  let templateRefCompFixture;
  let templateRefComp;
  let toppyRefMock;
  let eventBus: EventBus;
  const config = DefaultConfig;

  beforeEach(() => {
    utilsMock = {
      ID: 'xyz'
    };
    toppyRefMock = jasmine.createSpyObj('ToppyRef', ['close']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TemplateRefTestModule],
      declarations: [],
      providers: [Toppy, OverlayInstance, HostContainer, EventBus]
    }).compileComponents();

    templateRefCompFixture = TestBed.createComponent(TemplateRefTestComponent);
    templateRefComp = templateRefCompFixture.componentInstance;
    toppy = TestBed.get(Toppy);
    eventBus = TestBed.get(EventBus);
    componentHostMock = TestBed.get(HostContainer);
    overlayMock = TestBed.get(OverlayInstance);

    componentHostSpy = jasmine.createSpyObj('HostContainer', ['configure']);
    overlaySpy = jasmine.createSpyObj('overlayMock', ['configure']);
  }));

  afterEach(() => {
    toppy.ngOnDestroy();
  });
  it('should be initialized', () => {
    expect(toppy).toBeTruthy();
  });
  it('should have empty toppy references on load', () => {
    expect(Object.keys(Toppy.toppyRefs).length).toEqual(0);
  });
  it('should delete toppyRef on "REMOVED_OVERLAY_INS" event', () => {
    (toppy as any)._overlayID = 'abc123';
    toppy.create();
    expect(toppy.getToppyRef('abc123').overlayID).toBe('abc123');
    eventBus.post({ name: 'REMOVED_OVERLAY_INS', data: 'abc123' });
    expect(toppy.getToppyRef('abc123')).toBeUndefined();
  });
  describe('on calling "generateID" method', () => {
    it('should generate random ID of 5 characters', () => {
      expect((toppy as any)._generateID().length).toBe(5);
    });
  });
  describe('on calling "overlay" method', () => {
    it('should return same instance', () => {
      const instance = toppy.overlay(null);
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._overlayID).toBeDefined();
    });
  });
  describe('on calling "host" method', () => {
    let hostContainer;
    beforeEach(() => {
      toppy.overlay(null);
      hostContainer = (toppy as any)._hostContainerFreshInstance;
      spyOn(hostContainer, 'configure').and.callFake((...args) => {
        return args;
      });
    });
    it('should return same instance', () => {
      const instance = toppy.host(null);
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._overlayID).toBeDefined();
    });
    it('should call `HostContainer.configure` method once', () => {
      toppy.host(null);
      expect(hostContainer.configure).toHaveBeenCalledTimes(1);
    });
    it('should set string as input content', () => {
      const content = 'Hello';
      toppy.host(content);
      expect(hostContainer.configure).toHaveBeenCalledWith({ content });
    });
    it('should set HTML string as input content', () => {
      const content = '<b>Hello</b>';
      toppy.host(content, { hasHTML: true });
      expect(hostContainer.configure).toHaveBeenCalledWith({ content, props: { hasHTML: true } });
    });
    it('should set TemplateRef as input content', fakeAsync(() => {
      const content = templateRefComp.tpl;
      templateRefCompFixture.detectChanges();
      toppy.host(content);
      expect(hostContainer.configure).toHaveBeenCalledWith({
        content,
        contentType: 'TEMPLATEREF'
      });
    }));
    it('should set component as input content', fakeAsync(() => {
      const content = TestComponent;
      const id = ((toppy as any)._overlayID = 'abc123');
      toppy.host(content);
      expect(hostContainer.configure).toHaveBeenCalledWith({
        content,
        props: { id },
        contentType: 'COMPONENT'
      });
    }));
    it('should set component as input content with given props', fakeAsync(() => {
      const content = TestComponent;
      const id = ((toppy as any)._overlayID = 'abc123');
      toppy.host(content, { label: 'test-props' });
      expect(hostContainer.configure).toHaveBeenCalledWith({
        content,
        props: { id, label: 'test-props' },
        contentType: 'COMPONENT'
      });
    }));
  });
  describe('on calling "create" method', () => {
    it('should return `ToppyRef` instance', () => {
      const instance = toppy.create();
      expect(instance instanceof ToppyRef).toBeTruthy();
    });
    it('should add `ToppyRef` instance to _toppyRef array', () => {
      (toppy as any)._overlayID = 'abc123';
      const instance = toppy.create();
      expect(Object.keys(Toppy.toppyRefs).length).toEqual(1);
      expect(toppy.getToppyRef('abc123').constructor.name).toEqual('ToppyRef');
      expect(instance instanceof ToppyRef).toBeTruthy();
    });
    it('should call `ToppyRef.close` method if it already exists', () => {
      (toppy as any)._overlayID = 'mmm';
      const foo = (Toppy.toppyRefs['mmm'] = new ToppyRef(overlayMock, componentHostMock, eventBus, config, 'mmm'));
      spyOn(foo, 'close');
      const instance = toppy.create();
      expect(foo.close).toHaveBeenCalled();
      expect(foo.close).toHaveBeenCalledTimes(1);
    });
  });
});
