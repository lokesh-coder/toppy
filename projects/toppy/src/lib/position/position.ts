import { PositionCoOrds } from '../models';

export abstract class Position {
  abstract getPositions(host: HTMLElement): PositionCoOrds;
  getClassName(): string {
    return this.constructor.name.replace('Position', '-position').toLocaleLowerCase();
  }
}
