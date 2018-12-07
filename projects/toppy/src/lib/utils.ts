import { TemplateRef } from '@angular/core';
import { ComponentType, HostArgs, ToppyEvent, ContainerSize } from './models';
import { Subject, Observable } from 'rxjs';

export function getContentMeta(
  content: string | TemplateRef<any> | ComponentType<any>,
  props: { [x: string]: any } = {},
  overlayID = ''
) {
  let data: HostArgs;

  if (typeof content === 'string' && props['hasHTML']) {
    data = { content, contentType: 'STRING', props };
  } else if (typeof content === 'string') {
    data = { content, props };
  } else if (content instanceof TemplateRef) {
    data = { content, contentType: 'TEMPLATEREF', props: { id: overlayID } };
  } else {
    data = {
      content,
      props: { ...props, id: overlayID },
      contentType: 'COMPONENT'
    };
  }
  return data;
}


/* html dom utils */

export const html = {
  BODY: document.getElementsByTagName('body')[0]
};

export function createElement(elementName: string, attr = {}): HTMLElement {
  const element = document.createElement(elementName);
  Object.keys(attr).forEach(name => element.setAttribute(name, attr[name]));
  return element;
}

export function insertChildren(parentElement: HTMLElement, ...childElements: HTMLElement[]): HTMLElement {
  let prevParent = parentElement;
  childElements.forEach(elem => {
    prevParent = prevParent.appendChild(elem);
  });
  return prevParent;
}

export function setHtml(parentElement: HTMLElement, childElement: any): HTMLElement {
  parentElement.innerHTML = childElement;
  return parentElement;
}

export function setPositions(element: HTMLElement, positions: object) {
  Object.keys(positions).forEach(prop => {
    element.style[prop] = typeof positions[prop] === 'number' ? `${positions[prop]}px` : positions[prop];
  });
}

export function applySize(element: HTMLElement, size: ContainerSize) {
  const { width, height } = size;
  Object.keys(size).forEach(attr => {
    return (element.style[attr] = size[attr]);
  });
}

export function removeElement(element: HTMLElement) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

export function addClassNameToBody(className: string) {
  document.querySelector('body').classList.add(className);
}
export function removeClassNameFromBody(className: string) {
  document.querySelector('body').classList.remove(className);
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

