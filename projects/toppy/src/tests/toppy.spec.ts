import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DefaultConfig } from '../lib/config';
import { EventBus } from '../lib/helper/event-bus';
import { HostContainer } from '../lib/host-container';
import { OverlayInstance } from '../lib/overlay-instance';
import { Toppy } from '../lib/toppy';
import { ToppyRef } from '../lib/toppy-ref';

describe('== Toppy ==', () => {
  let toppy: Toppy = null;
  let overlaySpy;
  let overlayMock;
  let componentHostSpy;
  let componentHostMock;
  let eventBusMock;
  let utilsMock;
  let toppyRefMock;
  const config = DefaultConfig;
  let ov;

  beforeEach(() => {
    eventBusMock = {
      watch() {
        return of({ name: 'test' });
      },
      post() {},
      destroy() {}
    };
    utilsMock = {
      ID: 'xyz'
    };
    toppyRefMock = jasmine.createSpyObj('ToppyRef', ['close']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [Toppy, OverlayInstance, HostContainer, { provide: EventBus, useValue: eventBusMock }]
    }).compileComponents();
    toppy = TestBed.get(Toppy);
    componentHostMock = TestBed.get(HostContainer);
    overlayMock = TestBed.get(OverlayInstance);

    ov = (toppy as any)._overlayIns;
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
  describe('on calling overlay method', () => {
    it('should return same instance', () => {
      const instance = toppy.overlay(null);
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._overlayID).toBeDefined();
    });
    // it('should call `overlayInstance.configure` method once', () => {
    //   toppy.overlay(null);
    //   console.log(toppy, overlaySpy);
    //   expect(overlaySpy.configure).toHaveBeenCalledTimes(1);
    // });
  });
  describe('on calling host method', () => {
    it('should return same instance', () => {
      toppy.overlay(null);
      const instance = toppy.host(null);
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._overlayID).toBeDefined();
    });
    // it('should call `ComponentHost.configure` method once', () => {
    //   toppy.overlay(null);
    //   toppy.host(null);
    //   expect(componentHostSpy.configure).toHaveBeenCalledTimes(1);
    // });
  });
  describe('on calling create method', () => {
    it('should return `ToppyRef` instance', () => {
      const instance = toppy.create();
      expect(instance instanceof ToppyRef).toBeTruthy();
    });
    it('should add `ToppyRef` instance to _toppyRef array', () => {
      (toppy as any)._overlayID = 'abc123';
      const instance = toppy.create();
      expect(Object.keys(Toppy.toppyRefs).length).toEqual(1);
      expect(Toppy.toppyRefs['abc123'].constructor.name).toEqual('ToppyRef');
      expect(instance instanceof ToppyRef).toBeTruthy();
    });
    it('should call `ToppyRef.close` method if it already exists', () => {
      (toppy as any)._overlayID = 'mmm';
      const foo = (Toppy.toppyRefs['mmm'] = new ToppyRef(overlayMock, componentHostMock, eventBusMock, config, 'mmm'));
      spyOn(foo, 'close');
      const instance = toppy.create();
      expect(foo.close).toHaveBeenCalled();
      expect(foo.close).toHaveBeenCalledTimes(1);
    });
  });
});
