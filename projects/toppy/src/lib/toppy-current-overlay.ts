export class ToppyCurrentOverlay {
  constructor(private ref, private id) {}
  close() {
    this.ref.close();
  }
}
