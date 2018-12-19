export class ToppyOverlay {
  constructor(private properties: any) {}
  get props() {
    return this.properties;
  }
  close() {
    return this.properties.close();
  }
}
