import { TestBed, async } from '@angular/core/testing';
import { Toppy, OverlayInstance, HostContainer, Messenger, Utils, ToppyRef } from 'toppy';
import { of } from 'rxjs';

describe('== Blink ==', () => {
  let toppy: Toppy<any> = null;
  let overlayMock;
  let componentHostMock;
  let messengerMock;
  let utilsMock;
  let toppyRefMock;

  beforeEach(() => {
    overlayMock = jasmine.createSpyObj('OverlayInstance', ['configure', 'destroy', 'cleanup']);
    componentHostMock = jasmine.createSpyObj('ComponentHost', ['configure']);
    messengerMock = {
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
        { provide: Messenger, useValue: messengerMock },
        { provide: Utils, useValue: utilsMock },
        { provide: ToppyRef, useValue: toppyRefMock }
      ]
    }).compileComponents();
    toppy = TestBed.get(Toppy);
  }));
  it('should be initialized', () => {
    expect(toppy).toBeTruthy();
  });
  it('should have empty toppy references on load', () => {
    expect((toppy as any)._toppyRefs.length).toEqual(0);
  });
  describe('on calling overlay method', () => {
    it('should return same instance', () => {
      const instance = toppy.overlay(null, 'abc');
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._id).toEqual('abc');
    });
    it('should set `id`', () => {
      toppy.overlay(null, '123456');
      expect((toppy as any)._id).toBe('123456');
    });
    it('should call `overlayInstance.configure` method once', () => {
      toppy.overlay(null, 'xyz');
      expect(overlayMock.configure).toHaveBeenCalledTimes(1);
    });
  });
  describe('on calling host method', () => {
    it('should return same instance', () => {
      const instance = toppy.host(null);
      toppy.overlay(null, 'qwerty');
      expect(instance instanceof Toppy).toBeTruthy();
      expect((instance as any)._id).toEqual('qwerty');
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
    it('should add `BlinkRef` instance to _toppyRef array', () => {
      (toppy as any)._id = 'abc123';
      const instance = toppy.create();
      expect(Object.keys((toppy as any)._toppyRefs).length).toEqual(1);
      expect((toppy as any)._toppyRefs['abc123'].constructor.name).toEqual('BlinkRef');
      expect(instance instanceof ToppyRef).toBeTruthy();
    });
    it('should call `BlinkRef.close` method if it already exists', () => {
      (toppy as any)._id = 'mmm';
      const foo = ((toppy as any)._toppyRefs['mmm'] = new ToppyRef(
        overlayMock,
        componentHostMock,
        messengerMock,
        'mmm'
      ));
      spyOn(foo, 'close');
      const instance = toppy.create();
      expect(foo.close).toHaveBeenCalled();
      expect(foo.close).toHaveBeenCalledTimes(1);
    });
  });
});
