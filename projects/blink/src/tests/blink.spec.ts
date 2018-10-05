import { TestBed, async } from '@angular/core/testing';
import { Blink, OverlayInstance, ComponentHost, Messenger, Utils, BlinkRef } from 'blink';
import { of } from 'rxjs';

describe('== Blink ==', () => {
  let blink: Blink<any> = null;
  let overlayMock;
  let componentHostMock;
  let messengerMock;
  let utilsMock;
  let blinkRefMock;

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
    blinkRefMock = jasmine.createSpyObj('BlinkRef', ['close']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        Blink,
        { provide: OverlayInstance, useValue: overlayMock },
        { provide: ComponentHost, useValue: componentHostMock },
        { provide: Messenger, useValue: messengerMock },
        { provide: Utils, useValue: utilsMock },
        { provide: BlinkRef, useValue: blinkRefMock }
      ]
    }).compileComponents();
    blink = TestBed.get(Blink);
  }));
  it('should be initialized', () => {
    expect(blink).toBeTruthy();
  });
  it('should have empty blink references on load', () => {
    expect((blink as any)._blinkRefs.length).toEqual(0);
  });
  describe('on calling overlay method', () => {
    it('should return same instance', () => {
      const instance = blink.overlay(null, 'abc');
      expect(instance instanceof Blink).toBeTruthy();
      expect((instance as any)._id).toEqual('abc');
    });
    it('should set `id`', () => {
      blink.overlay(null, '123456');
      expect((blink as any)._id).toBe('123456');
    });
    it('should call `overlayInstance.configure` method once', () => {
      blink.overlay(null, 'xyz');
      expect(overlayMock.configure).toHaveBeenCalledTimes(1);
    });
  });
  describe('on calling host method', () => {
    it('should return same instance', () => {
      const instance = blink.host(null);
      blink.overlay(null, 'qwerty');
      expect(instance instanceof Blink).toBeTruthy();
      expect((instance as any)._id).toEqual('qwerty');
    });
    it('should call `ComponentHost.configure` method once', () => {
      blink.host(null);
      expect(componentHostMock.configure).toHaveBeenCalledTimes(1);
    });
  });
  describe('on calling create method', () => {
    it('should return `BlinkRef` instance', () => {
      const instance = blink.create();
      expect(instance instanceof BlinkRef).toBeTruthy();
    });
    it('should add `BlinkRef` instance to _blinkRef array', () => {
      (blink as any)._id = 'abc123';
      const instance = blink.create();
      expect(Object.keys((blink as any)._blinkRefs).length).toEqual(1);
      expect((blink as any)._blinkRefs['abc123'].constructor.name).toEqual('BlinkRef');
      expect(instance instanceof BlinkRef).toBeTruthy();
    });
    it('should call `BlinkRef.close` method if it already exists', () => {
      (blink as any)._id = 'mmm';
      const foo = ((blink as any)._blinkRefs['mmm'] = new BlinkRef(
        overlayMock,
        componentHostMock,
        messengerMock,
        'mmm'
      ));
      spyOn(foo, 'close');
      const instance = blink.create();
      expect(foo.close).toHaveBeenCalled();
      expect(foo.close).toHaveBeenCalledTimes(1);
    });
  });
});
