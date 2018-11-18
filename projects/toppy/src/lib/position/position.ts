// import { PositionCoOrds } from '../models';

export abstract class Position {
  abstract getPositions(host: HTMLElement): any;
  abstract updateConfig(config: object): any;
  getClassName(): string {
    return this.constructor.name.replace('Position', '-position').toLocaleLowerCase();
  }
}
