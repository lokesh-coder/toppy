import { TestBed, async } from '@angular/core/testing';
import { HostContainer } from 'toppy';
import { Component, NgModule } from '@angular/core';

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
  let componentHost: HostContainer<HostComponent> = null;
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
    expect(componentHost.componentView()).toBeNull();
    componentHost.configure(HostComponent, {});
    componentHost.attach();
    const hostComponentText = componentHost.componentView().querySelector('h1').textContent;
    expect(hostComponentText).toBe('Hello');
  });
  it('should detach component', () => {
    componentHost.configure(HostComponent, {});

    componentHost.attach();
    const hostComponentText = componentHost.componentView().querySelector('h1').textContent;
    expect(hostComponentText).toBe('Hello');

    componentHost.detach();
    expect(componentHost.componentView()).toBeNull();
  });
  it('should return component instance', () => {
    componentHost.configure(HostComponent, {});
    componentHost.attach();
    expect(componentHost.getCompIns().component instanceof HostComponent).toBeTruthy();
  });
});
