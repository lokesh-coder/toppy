import { async, TestBed } from '@angular/core/testing';
import { skip, take } from 'rxjs/operators';
import { DefaultConfig } from 'toppy/lib/config';
import { HostContainer } from '../lib/host-container';
import { InsidePlacement } from '../lib/models';
import { OverlayInstance } from '../lib/overlay-instance';
import { GlobalPosition } from '../lib/position/global-position';
import { _on, initE, destroyEvents } from 'toppy/lib/utils';

describe('== OverlayInstance ==', () => {
  let overlayIns: OverlayInstance = null;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [OverlayInstance, HostContainer]
    });
    overlayIns = TestBed.get(OverlayInstance);
    overlayIns.setConfig(DefaultConfig);
  }));

  beforeEach(() => {
    overlayIns.configure(new GlobalPosition({ placement: InsidePlacement.CENTER }), 'abc');
    initE();
  });
  afterEach(() => {
    overlayIns.destroy();

    destroyEvents();
  });

  it('should be initialized', () => {
    expect(overlayIns).toBeTruthy();
  });

  it('should create Overlay element in DOM', () => {
    const containerElements = document.getElementsByClassName(overlayIns.config.containerClass);
    expect(containerElements.length).toEqual(0);
    overlayIns.create();
    expect(containerElements.length).toEqual(1);
  });
  it('should create host container element in DOM', () => {
    const containerElements = document.getElementsByClassName(overlayIns.config.wrapperClass);
    expect(containerElements.length).toEqual(0);
    overlayIns.create();
    expect(containerElements.length).toEqual(1);
  });
  it('should emit attached event', (done) => {
    _on()
      .pipe(
        skip(1),
        take(1)
      )
      .subscribe(event => {
        expect(event['name']).toBe('ATTACHED');
        done();
      });
    overlayIns.create();
  });
  it('should have backdrop element in DOM', () => {
    const containerElements = document.getElementsByClassName(overlayIns.config.backdropClass);
    expect(containerElements.length).toEqual(0);
    overlayIns.config.backdrop = true;
    overlayIns.create();
    expect(containerElements.length).toEqual(1);
  });
  it('should delete overlay container element from DOM', () => {
    const containerElements = document.getElementsByClassName(overlayIns.config.containerClass);
    expect(containerElements.length).toEqual(0);
    overlayIns.create();
    expect(containerElements.length).toEqual(1);
    overlayIns.destroy();
    expect(containerElements.length).toEqual(0);
  });
  it('should emit detached event', (done) => {
    overlayIns.create();
    _on()
      .pipe(
        // skip(1),
        // take(1)
      )
      .subscribe(event => {
        expect(event['name']).toBe('DETACHED');
        done();
      });
    overlayIns.destroy();
  });
  it('should inject view in to DOM', () => {
    overlayIns.create();
    const hostElements = document.getElementsByTagName('foobar');
    expect(hostElements.length).toEqual(0);
    overlayIns.destroy();

    overlayIns.create();
    overlayIns.setView(document.createElement('foobar'));
    expect(hostElements.length).toEqual(1);
  });
  it('should verify whether the host element is mounted', () => {
    overlayIns.create();
    const fooEl = document.createElement('foo');
    const barEl = document.createElement('bar');
    const containerElement = document.getElementsByClassName(overlayIns.config.containerClass)[0];
    const hostContainerElement = document.getElementsByClassName(overlayIns.config.wrapperClass)[0];
    overlayIns.setView(fooEl);
    expect(overlayIns.isHostElement(fooEl)).toBeFalsy();
    expect(overlayIns.isHostElement(hostContainerElement)).toBeFalsy();
    expect(overlayIns.isHostElement(barEl)).toBeTruthy();
    expect(overlayIns.isHostElement(document)).toBeTruthy();
    expect(overlayIns.isHostElement(containerElement)).toBeTruthy();
  });
});
