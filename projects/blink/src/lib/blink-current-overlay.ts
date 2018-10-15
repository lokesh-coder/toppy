import { Blink } from './blink';

export class BlinkCurrentOverlay {
  constructor(private ref, private id) {}
  close() {
    this.ref.close();
  }
}
