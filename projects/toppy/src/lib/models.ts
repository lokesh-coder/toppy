import { TemplateRef } from '@angular/core';
import { ToppyPosition } from './position/position';

export interface PositionMeta {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  height?: number | string;
  width?: number | string;
  position?: string;
  extra?: string;
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
  listenWindowEvents: boolean;
  closeOnDocClick: boolean;
  bodyClass: string;
  closeOnEsc: boolean;
  windowResizeCallback: () => void;
  docClickCallback: () => void;
}

export interface ComponentType<T> {
  new (...args: any[]): T;
}

export type TID = string;

export type ToppyEventName = 't_open' | 't_close' | 't_dynpos' | 't_detach' | 't_posupdate' | 't_compins';

export interface ToppyEvent {
  from: TID;
  name: ToppyEventName;
  data?: any;
}

export const enum ContentType {
  STRING = 's',
  HTML = 'h',
  TEMPLATE = 't',
  COMPONENT = 'c'
}
export type ContentData = string | TemplateRef<any> | ComponentType<any>;
export type ContentProps = { [x: string]: any } | any;

export interface Content {
  type?: ContentType;
  data: ContentData;
  props?: ContentProps;
}

export interface Inputs {
  position: ToppyPosition | null;
  config: ToppyConfig;
  content: Content;
  tid: TID;
}
