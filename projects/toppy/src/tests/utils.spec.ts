import { Component, TemplateRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContentType } from '../lib/models';
import { Bus, getContent } from '../lib/utils';

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

describe('@ Utils', () => {
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

  describe('#getContent', () => {
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
      expect(result as any).toEqual({ data: fixture, props: {}, type: ContentType.COMPONENT });
    });
    it('should return component type with props', () => {
      const result: any = getContent(fixture as any, { name: 'john' });
      expect(result).toEqual({
        data: fixture,
        props: { name: 'john' },
        type: ContentType.COMPONENT
      } as any);
    });
    it('should return component type with overlay id', () => {
      const result = getContent(fixture as any, { id: 'XYZ' });
      expect(result as any).toEqual({ data: fixture, props: { id: 'XYZ' }, type: ContentType.COMPONENT });
    });
    it('should return template type', () => {
      const result = getContent(component.tpl, { id: 'ABC' });
      expect(result as any).toEqual({ data: component.tpl, type: ContentType.TEMPLATE, props: { id: 'ABC' } });
    });
  });
  describe('#BusClass', () => {
    let die: Subject<boolean>;
    // spyOn(Bus,'stop').and.callFake();
    beforeEach(() => {
      die = new Subject();
      Bus['_e'] = new Subject();
    });
    afterEach(() => {
      die.next(true);
      die.complete();
      Bus.stop();
    });
    afterAll(() => {
      Bus['_e'] = new Subject();
    });
    it('should send event on calling `sent` method', done => {
      Bus.listen('abc', 't_open')
        .pipe(takeUntil(die))
        .subscribe(data => {
          expect(data).toEqual({ test: true });
          done();
        });
      Bus.send('abc', 't_open', { test: true });
    });
    it('should send multiple event on calling many `sent` method', done => {
      const spy = jasmine.createSpy('spy').and.callThrough();
      Bus.listen('xyz', 't_detach')
        .pipe(takeUntil(die))
        .subscribe(() => {
          spy();
          done();
        });
      Bus.send('xyz', 't_detach', `qwerty`);
      Bus.send('xyz', 't_detach', `home`);
      Bus.send('xyz', 't_detach', `Bakery`);
      expect(spy.calls.count()).toEqual(3);
    });
    it('should complete the emission on calling `stop` method', done => {
      const spy = jasmine.createSpy('spy').and.callThrough();
      Bus.listen('xyz', 't_dynpos')
        .pipe(takeUntil(die))
        .subscribe(
          data => {
            spy();
          },
          null,
          () => {
            done();
          }
        );
      Bus.send('xyz', 't_dynpos', `qwerty`);
      Bus.send('xyz', 't_dynpos', `home`);
      Bus.stop();
      Bus.send('xyz', 't_dynpos', `Bakery`);
      expect(spy.calls.count()).toEqual(2);
    });
  });
});
