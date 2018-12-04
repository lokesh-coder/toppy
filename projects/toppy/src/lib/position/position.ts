import { EventBus } from '../helper/event-bus';

// import { PositionCoOrds } from '../models';

export abstract class Position {
  eventBus: EventBus;
  protected _config = {};
  abstract getPositions(host: HTMLElement): any;
  getClassName(): string {
    return this.constructor.name.replace('Position', '-position').toLocaleLowerCase();
  }
  setEventBus(eventBus: EventBus) {
    this.eventBus = eventBus;
  }
  updateConfig(config) {
    this._config = { ...this._config, ...config };
  }
}
