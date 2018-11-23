import { ToppyConfig } from './models';

export const DefaultConfig: ToppyConfig = {
  backdrop: false,
  containerClass: 'toppy-container',
  wrapperClass: 'toppy-wrapper',
  backdropClass: 'toppy-backdrop',
  dismissOnDocumentClick: true,
  parentElement: null,
  watchDocClick: true,
  watchWindowResize: true,
  bodyClassNameOnOpen: '',
  windowResizeCallback: () => {},
  docClickCallback: () => {}
};
