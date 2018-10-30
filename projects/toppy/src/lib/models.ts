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
export enum InsidePlacement {
  TOP,
  LEFT,
  RIGHT,
  CENTER,
  BOTTOM,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT
}
export enum OutsidePlacement {
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
  LEFT_TOP,
  TOP_LEFT,
  RIGHT_TOP,
  TOP_RIGHT,
  BOTTOM_LEFT,
  LEFT_BOTTOM,
  BOTTOM_RIGHT,
  RIGHT_BOTTOM
}

export enum SlidePlacement {
  LEFT,
  RIGHT
}

export interface ContainerSize {
  width: string | number;
  height: string | number;
}

export interface BaseConfig {
  backdrop: boolean;
  containerClass: string;
  wrapperClass: string;
  backdropClass: string;
  watchWindowResize: boolean;
  watchDocClick: boolean;
  dismissOnDocumentClick: boolean;
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
