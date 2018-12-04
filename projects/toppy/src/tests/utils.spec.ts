import { Component, TemplateRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { getContentMeta } from '../lib/utils';

@Component({
  selector: 'lib-test-component',
  template: `
    <h1 id="greet">Hello</h1>
    <ng-template #tpl>I am a template!</ng-template>
  `
})
export class TestComponent {
  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;
}

describe('== Utils ==', () => {
  let component: TestComponent = null;
  let fixture: ComponentFixture<TestComponent> = null;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: []
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  }));
  afterEach(function() {
    fixture.destroy();
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  describe('on calling "getContentMeta" function', () => {
    it('should return as string type', () => {
      const result = getContentMeta('hello');
      expect(result).toEqual({ content: 'hello' } as any);
    });
    it('should return html type', () => {
      const result = getContentMeta('<div>Hello</div>', { hasHTML: true });
      expect(result).toEqual({ content: '<div>Hello</div>', props: { hasHTML: true }, contentType: 'STRING' } as any);
    });
    it('should return component type', () => {
      const result = getContentMeta(fixture as any);
      expect(result).toEqual({ content: fixture, props: { id: '' }, contentType: 'COMPONENT' } as any);
    });
    it('should return component type with props', () => {
      const result = getContentMeta(fixture as any, { name: 'john' });
      expect(result).toEqual({ content: fixture, props: { name: 'john', id: '' }, contentType: 'COMPONENT' } as any);
    });
    it('should return component type with overlay id', () => {
      const result = getContentMeta(fixture as any, {}, 'XYZ');
      expect(result).toEqual({ content: fixture, props: { id: 'XYZ' }, contentType: 'COMPONENT' } as any);
    });
    it('should return template type', () => {
      const result = getContentMeta(component.tpl);
      expect(result).toEqual({ content: component.tpl, contentType: 'TEMPLATEREF' } as any);
    });
  });
});
