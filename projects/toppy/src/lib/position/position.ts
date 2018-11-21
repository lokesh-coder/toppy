import { EventBus } from '../helper/event-bus';

// import { PositionCoOrds } from '../models';

export abstract class Position {
  eventBus: EventBus;
  abstract getPositions(host: HTMLElement): any;
  abstract updateConfig(config: object): any;
  setEventBus(eventBus) {
    this.eventBus = eventBus;
  }
  getClassName(): string {
    return this.constructor.name.replace('Position', '-position').toLocaleLowerCase();
  }
}
