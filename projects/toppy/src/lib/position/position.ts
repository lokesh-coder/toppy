export abstract class ToppyPosition {
  protected config = {};
  abstract getPositions(host: HTMLElement): any;

  getClassName(): string {
    return this.constructor.name.replace('Pos', '-pos').toLowerCase();
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  init(tid: string) {}
}
