import { TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Content, ContentData, ContentProps, ContentType, ToppyEvent } from './models';

export function getContent(data: ContentData, props: ContentProps = {}): Content {
  let type: ContentType = ContentType.COMPONENT;

  if (typeof data === 'string' && props['hasHTML']) type = ContentType.HTML;
  else if (typeof data === 'string') type = ContentType.STRING;
  else if (data instanceof TemplateRef) type = ContentType.TEMPLATE;

  return { data, type, props };
}

export function createId() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
}

/* html dom utils */

export function cssClass(method: 'add' | 'remove', className: string, target: string = 'body') {
  document.querySelector(target).classList.add(className);
}

export function toCss(styleObj) {
  return Object.keys(styleObj)
    .map(x => (typeof styleObj[x] === 'number' ? `${x}:${styleObj[x]}px` : `${x}:${styleObj[x]}`))
    .join(';');
}

/* events */

let _e: Subject<any> = new Subject();

export function _fire(e: ToppyEvent): void {
  _e.next(e);
}

export function _on(): Observable<any> {
  return _e.asObservable();
}

export function _off(): void {
  _e.complete();
}

export function initE(): void {
  _e = new Subject();
}
