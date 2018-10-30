import { Component, NgModule } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { HostContainer } from '../lib/host-container';

@Component({
  selector: 'main-component',
  template: '<div>Main component</div>'
})
export class MainComponent {}

@Component({
  selector: 'host-component',
  template: '<h1 id="greet">Hello</h1>'
})
export class HostComponent {}

@NgModule({
  declarations: [HostComponent, MainComponent],
  entryComponents: [HostComponent],
  exports: [HostComponent, MainComponent],
  providers: [HostContainer]
})
export class TestModule {}

describe('== ComponentHost ==', () => {
  let componentHost: HostContainer = null;
  let fixture: HostComponent = null;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
    fixture = TestBed.createComponent(MainComponent).componentInstance;
    componentHost = TestBed.get(HostContainer);
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
});
