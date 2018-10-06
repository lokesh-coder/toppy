import { Blink } from './blink';

export class BlinkCurrentOverlay {
  constructor(private id) {
    console.log('me', this);
  }
  close() {
    console.log('=>', Blink.refs);
    Blink.refs[this.id].close();
  }
}
