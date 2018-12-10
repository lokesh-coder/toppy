import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToppyControl } from '../lib/toppy-control';

@Component({
  selector: 'lib-test-component',
  template: '<div>DYNAMIC COMP</div>'
})
export class TestComponent {
  name = 'lib-test-component';
}

@NgModule({
  declarations: [TestComponent],
  entryComponents: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {}

describe('== ToppyControl ==', () => {
  let toppyControl: ToppyControl = null;
  let debugEl: DebugElement = null;
  let fixture: ComponentFixture<TestComponent> = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [ToppyControl]
    }).compileComponents();

    toppyControl = TestBed.get(ToppyControl);
    fixture = TestBed.createComponent(TestComponent);
    debugEl = fixture.debugElement;
  }));

  afterEach(function() {
    fixture.destroy();
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  it('should initialize', () => {
    expect(toppyControl).toBeTruthy();
  });
  describe('when calling "open" method', () => {
    // it("shoudl");
  });
});
