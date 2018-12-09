import { TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ComponentType, ContentType, HostArgs, ToppyEvent } from './models';

export function getContentMeta(
  data: string | TemplateRef<any> | ComponentType<any>,
  props: { [x: string]: any } = {}
): HostArgs {
  let type: ContentType = ContentType.COMPONENT;

  if (typeof data === 'string' && props['hasHTML']) {
    type = ContentType.HTML;
  } else if (typeof data === 'string') {
    type = ContentType.STRING;
  } else if (data instanceof TemplateRef) {
    type = ContentType.TEMPLATE;
  }
  return {
    data,
    type,
    props
  };
}

/* html dom utils */

export function addClassNameToBody(className: string) {
  document.querySelector('body').classList.add(className);
}
export function removeClassNameFromBody(className: string) {
  document.querySelector('body').classList.remove(className);
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

export function destroyEvents(): void {
  _e.complete();
}

export function initE(): void {
  _e = new Subject();
}
