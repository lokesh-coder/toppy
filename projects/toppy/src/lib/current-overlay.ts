export class CurrentOverlay {
  constructor(private closeFn: Function) {}
  close() {
    return this.closeFn();
  }
}
