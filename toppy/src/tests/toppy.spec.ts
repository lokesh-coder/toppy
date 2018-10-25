import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Config } from '../lib/config';
import { EventBus } from '../lib/helper/event-bus';
import { HostContainer } from '../lib/host-container';
import { OverlayInstance } from '../lib/overlay-instance';
import { Toppy } from '../lib/toppy';
import { ToppyRef } from '../lib/toppy-ref';

describe('== Toppy ==', () => {
  let toppy: Toppy = null;
  let overlayMock;
  let componentHostMock;
  let eventBusMock;
  let utilsMock;
  let toppyRefMock;
  let config;

  beforeEach(() => {
    overlayMock = jasmine.createSpyObj('OverlayInstance', ['configure', 'destroy', 'cleanup']);
    componentHostMock = jasmine.createSpyObj('ComponentHost', ['configure']);
    eventBusMock = {
      watch() {
        return of({ name: 'test' });
      },
      post() {}
    };
    utilsMock = {
      ID: 'xyz'
    };
    toppyRefMock = jasmine.createSpyObj('BlinkRef', ['close']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        Toppy,
        { provide: OverlayInstance, useValue: overlayMock },
        { provide: HostContainer, useValue: componentHostMock },
        { provide: EventBus, useValue: eventBusMock },
        { provide: Config },
        { provide: ToppyRef, useValue: toppyRefMock }
      ]
    }).compileComponents();
    toppy = TestBed.get(Toppy);
    config = TestBed.get(Config);
  }));
  it('should be initialized', () => {
    expect(toppy).toBeTruthy();
  });
  it('should have empty toppy references on load', () => {
    expect((toppy as any)._toppyRefs.length).toEqual(0);
  });
  describe('on calling overlay method', () => {
    it('should return same instance', () => {
      const instance = toppy.overlay(null);
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._id).toBeDefined('abc');
    });
    it('should call `overlayInstance.configure` method once', () => {
      toppy.overlay(null);
      expect(overlayMock.configure).toHaveBeenCalledTimes(1);
    });
  });
  describe('on calling host method', () => {
    it('should return same instance', () => {
      const instance = toppy.host(null);
      toppy.overlay(null);
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._id).toBeDefined();
    });
    it('should call `ComponentHost.configure` method once', () => {
      toppy.host(null);
      expect(componentHostMock.configure).toHaveBeenCalledTimes(1);
    });
  });
  describe('on calling create method', () => {
    it('should return `BlinkRef` instance', () => {
      const instance = toppy.create();
      expect(instance instanceof ToppyRef).toBeTruthy();
    });
    it('should add `ToppyRef` instance to _toppyRef array', () => {
      (toppy as any)._overlayID = 'abc123';
      const instance = toppy.create();
      expect(Object.keys((toppy as any)._toppyRefs).length).toEqual(1);
      expect((toppy as any)._toppyRefs['abc123'].constructor.name).toEqual('BlinkRef');
      expect(instance instanceof ToppyRef).toBeTruthy();
    });
    it('should call `BlinkRef.close` method if it already exists', () => {
      (toppy as any)._overlayID = 'mmm';
      const foo = ((toppy as any)._toppyRefs['mmm'] = new ToppyRef(
        overlayMock,
        componentHostMock,
        eventBusMock,
        config,
        'mmm'
      ));
      spyOn(foo, 'close');
      const instance = toppy.create();
      expect(foo.close).toHaveBeenCalled();
      expect(foo.close).toHaveBeenCalledTimes(1);
    });
  });
});
