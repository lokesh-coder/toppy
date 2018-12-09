export class CurrentOverlay {
  constructor(private closeFn: Function) {}
  close() {
    this.closeFn();
  }
}
