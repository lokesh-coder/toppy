import { Component, NgModule, Optional, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { CurrentOverlay } from 'toppy/lib/current-overlay';
import { ToppyRef } from 'toppy/lib/toppy-ref';
import { HostContainer } from '../lib/host-container';

export class CurrentOverlayMock {
  toppyRef: ToppyRef;
  constructor(ref) {
    this.toppyRef = ref;
  }
  close() {
    this.toppyRef.close();
  }
}

export class ToppyRefMock {
  constructor(@Optional() public id: string) {}
  close() {}
}

@Component({
  selector: 'lib-main-component',
  template: `
    <div>Main component</div>
    <ng-template #tpl><span>Template content</span></ng-template>
  `
})
export class MainComponent {
  @ViewChild('tpl') tpl;
}

@Component({
  selector: 'lib-host-component',
  template: `
    <h1 id="greet">Hello</h1>
  `
})
export class HostComponent {
  constructor(@Optional() public currentOverlay: CurrentOverlay) {}
}

@NgModule({
  declarations: [HostComponent, MainComponent],
  entryComponents: [HostComponent],
  exports: [HostComponent, MainComponent],
  providers: [HostContainer, ToppyRefMock]
})
export class TestModule {}

describe('== ComponentHost ==', () => {
  let componentHost: HostContainer = null;
  let mainComp: MainComponent;
  let hostComp: HostComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
    mainComp = TestBed.createComponent(MainComponent).componentInstance;
    hostComp = TestBed.createComponent(HostComponent).componentInstance;
    componentHost = TestBed.get(HostContainer);
    componentHost.toppyRef = (id): any => new ToppyRefMock(id);
  }));

  it('should be initialized', () => {
    expect(componentHost).toBeTruthy();
  });
  it('should attach component to the angular zone', () => {
    expect(componentHost.getComponentViewEl()).toBeNull();
    componentHost.configure({ content: HostComponent, contentType: 'COMPONENT' });
    componentHost.attach();
    const hostComponentText = componentHost.getComponentViewEl().querySelector('h1').textContent;
    expect(hostComponentText).toBe('Hello');
  });
  it('should detach component', () => {
    componentHost.configure({ content: HostComponent, contentType: 'COMPONENT' });

    componentHost.attach();
    const hostComponentText = componentHost.getComponentViewEl().querySelector('h1').textContent;
    expect(hostComponentText).toBe('Hello');

    componentHost.detach();
    expect(componentHost.getComponentViewEl()).toBeNull();
  });
  it('should return component instance', () => {
    componentHost.configure({ content: HostComponent, contentType: 'COMPONENT' });
    componentHost.attach();
    expect(componentHost.getCompIns() instanceof HostComponent).toBeTruthy();
  });
  it('should return html node on calling "createViewFromString" method', () => {
    const view = componentHost.createViewFromString('<div>Hello</div>');
    expect(view.textContent).toBe('<div>Hello</div>');
  });
  it('should return html node on calling "attach" method without specifying contentType', () => {
    componentHost.configure({
      content: 'FOOBAR'
    });
    const view = componentHost.attach();
    expect(view.textContent).toBe('FOOBAR');
  });
  it('should return template view on calling "attach" method', () => {
    componentHost.configure({
      content: 'QWERTY',
      contentType: 'STRING'
    });
    const view = componentHost.attach();
    expect(view.textContent).toBe('QWERTY');
  });
  it('should return template view on calling "createViewFromTemplate" method - without id', () => {
    const view = componentHost.createViewFromTemplate(mainComp.tpl);
    expect(view.rootNodes[0].textContent).toBe('Template content');
    expect(view.context.$implicit).toEqual({ });
  });
  it('should return template view on calling "createViewFromTemplate" method - with id', () => {
    const view = componentHost.createViewFromTemplate(mainComp.tpl, {id: 'abc'});
    expect(view.rootNodes[0].textContent).toBe('Template content');
    expect(view.context.$implicit._ref).toBeTruthy();
  });
  it('should return template view on calling "attach" method', () => {
    componentHost.configure({
      content: mainComp.tpl,
      contentType: 'TEMPLATEREF'
    });
    const view = componentHost.attach();
    expect(view.textContent).toBe('Template content');
  });
  it('should inject "CurrentOverlay" service on comp init', () => {
    componentHost.createViewFromComponent(HostComponent, { id: 123 });
    expect(componentHost.getCompIns() instanceof HostComponent).toBeTruthy();
    expect((componentHost as any)._compIns.currentOverlay._ref instanceof ToppyRefMock).toBeTruthy();
  });
  it('should reset content meta on calling "reset" method', () => {
    componentHost.configure({
      content: 'QWERTY',
      contentType: 'STRING'
    });
    expect((componentHost as any)._content).toBe('QWERTY');
    componentHost.reset();
    expect((componentHost as any)._content).toBe(null);
  });
});
