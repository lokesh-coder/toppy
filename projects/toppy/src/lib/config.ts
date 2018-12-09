import { ToppyConfig } from './models';

export const DefaultConfig: ToppyConfig = {
  backdrop: false,
  containerClass: 't-container',
  wrapperClass: 't-wrapper',
  backdropClass: 't-backdrop',
  dismissOnDocumentClick: false,
  parentElement: null,
  watchDocClick: true,
  watchWindowResize: true,
  bodyClassNameOnOpen: 't-open',
  closeOnEsc: false,
  windowResizeCallback: () => {},
  docClickCallback: () => {}
};
