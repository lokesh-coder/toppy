export class CurrentOverlay {
  constructor(private ref) {}
  close() {
    this.ref.close();
  }
}
