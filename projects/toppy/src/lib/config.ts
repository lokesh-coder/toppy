import { ToppyConfig } from './models';

export const DefaultConfig: ToppyConfig = {
  containerClass: 't-overlay',
  bodyClass: 't-open',
  wrapperClass: '',
  backdropClass: '',
  backdrop: false,
  closeOnDocClick: false,
  listenWindowEvents: true,
  closeOnEsc: false,
  windowResizeCallback: () => {},
  docClickCallback: () => {}
};
