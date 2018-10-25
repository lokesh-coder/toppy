import { async, TestBed } from '@angular/core/testing';
import { skip, take } from 'rxjs/operators';
import { DomHelper } from '../lib/helper/dom';
import { EventBus } from '../lib/helper/event-bus';
import { HostContainer } from '../lib/host-container';
import { InsidePlacement } from '../lib/models';
import { OverlayInstance } from '../lib/overlay-instance';
import { GlobalPosition } from '../lib/position/global-position';

describe('== OverlayInstance ==', () => {
  let overlayIns: OverlayInstance = null;
  let eventBus: EventBus = null;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [OverlayInstance, DomHelper, HostContainer, EventBus]
    });
    overlayIns = TestBed.get(OverlayInstance);
    eventBus = TestBed.get(EventBus);
  }));

  beforeEach(() => {
    overlayIns.configure(new GlobalPosition({ placement: InsidePlacement.CENTER }), 'abc');
  });
  afterEach(() => {
    overlayIns.destroy();
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
  it('should emit attached event', () => {
    eventBus
      .watch()
      .pipe(
        skip(1),
        take(1)
      )
      .subscribe(event => {
        expect(event['name']).toBe('ATTACHED');
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
  it('should emit detached event', () => {
    overlayIns.create();
    eventBus
      .watch()
      .pipe(
        skip(1),
        take(1)
      )
      .subscribe(event => {
        expect(event['name']).toBe('DETACHED');
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
