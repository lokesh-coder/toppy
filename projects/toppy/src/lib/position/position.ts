export abstract class ToppyPosition {
  protected config = {};
  abstract getPositions(host: HTMLElement): any;
  getClassName(): string {
    return this.constructor.name.replace('Position', '-position').toLocaleLowerCase();
  }

  init(tid: string) {}

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }
}
