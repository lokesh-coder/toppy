
export abstract class Position {
  protected _config = {};
  abstract getPositions(host: HTMLElement): any;
  getClassName(): string {
    return this.constructor.name.replace('Position', '-position').toLocaleLowerCase();
  }

  updateConfig(config) {
    this._config = { ...this._config, ...config };
  }
}
