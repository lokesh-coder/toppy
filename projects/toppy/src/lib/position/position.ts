import { EventBus } from '../helper/event-bus';

// import { PositionCoOrds } from '../models';

export abstract class Position {
  eventBus: EventBus;
  abstract getPositions(host: HTMLElement): any;
  abstract updateConfig(config: object): any;
  getClassName(): string {
    return this.constructor.name.replace('Position', '-position').toLocaleLowerCase();
  }
  setEventBus(eventBus: EventBus) {
    this.eventBus = eventBus;
  }
}
