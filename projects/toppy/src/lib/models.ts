import { TemplateRef } from '@angular/core';

export interface PositionCoOrds {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  height?: number | string;
  width?: number | string;
  position?: string;
}

enum p {
  TOP = 't',
  LEFT = 'l',
  RIGHT = 'r',
  BOTTOM = 'b',
  TOP_LEFT = 'tl',
  TOP_RIGHT = 'tr',
  BOTTOM_LEFT = 'bl',
  BOTTOM_RIGHT = 'br'
}

enum o {
  LEFT_TOP = 'lt',
  RIGHT_TOP = 'rt',
  LEFT_BOTTOM = 'lb',
  RIGHT_BOTTOM = 'rb'
}

enum i {
  CENTER = 'c'
}
export const OutsidePlacement = {
  ...p,
  ...o
};
export const InsidePlacement = {
  ...p,
  ...i
};
export type OutsidePlacement = p | o;
export type InsidePlacement = p | i;

export enum SlidePlacement {
  LEFT = 'l',
  RIGHT = 'r'
}

export interface ContainerSize {
  width: string | number;
  height: string | number;
}

export interface ToppyConfig {
  backdrop: boolean;
  containerClass: string;
  wrapperClass: string;
  backdropClass: string;
  watchWindowResize: boolean;
  watchDocClick: boolean;
  dismissOnDocumentClick: boolean;
  bodyClassNameOnOpen: string;
  closeOnEsc: boolean;
  isHover: boolean;
  parentElement: HTMLElement | null;
  windowResizeCallback: () => void;
  docClickCallback: () => void;
}

export interface ComponentType<T> {
  new (...args: any[]): T;
}

export interface ToppyEvent {
  name: string;
  data: any;
}

export type HostContentValue = TemplateRef<any> | string | ComponentType<any>;

export type HostContentType = 'STRING' | 'HTMLSTRING' | 'TEMPLATEREF' | 'COMPONENT';
export interface HostArgs {
  contentType?: HostContentType;
  content: HostContentValue;
  props?: { [key: string]: any };
}
