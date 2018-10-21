import { ToppyRef } from './toppy-ref';

export class CurrentOverlay {
  constructor(private _ref: ToppyRef) {}
  close() {
    this._ref.close();
  }
}
