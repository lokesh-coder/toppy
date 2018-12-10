import { Component, TemplateRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentType } from '../lib/models';
import { getContent } from '../lib/utils';

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

  describe('on calling "getContent" function', () => {
    it('should return as string type', () => {
      const result = getContent('hello');
      expect(result).toEqual({ data: 'hello', props: {}, type: ContentType.STRING });
    });
    it('should return html type', () => {
      const result = getContent('<div>Hello</div>', { hasHTML: true });
      expect(result).toEqual({
        data: '<div>Hello</div>',
        props: { hasHTML: true },
        type: ContentType.HTML
      });
    });
    it('should return component type', () => {
      const result = getContent(fixture as any);
      expect(result).toEqual({ data: fixture, props: {}, type: ContentType.COMPONENT });
    });
    it('should return component type with props', () => {
      const result = getContent(fixture as any, { name: 'john' });
      expect(result).toEqual({
        data: fixture,
        props: { name: 'john' },
        type: ContentType.COMPONENT
      });
    });
    it('should return component type with overlay id', () => {
      const result = getContent(fixture as any, { id: 'XYZ' });
      expect(result).toEqual({ data: fixture, props: { id: 'XYZ' }, type: ContentType.COMPONENT });
    });
    it('should return template type', () => {
      const result = getContent(component.tpl, { id: 'ABC' });
      expect(result).toEqual({ data: component.tpl, type: ContentType.TEMPLATE, props: { id: 'ABC' } });
    });
  });
});
