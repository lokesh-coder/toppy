import { PositionCoOrds } from '../models';
import { Position } from './position';
import { EventBus } from '../helper/event-bus';
import { animationFrameScheduler, fromEvent } from 'rxjs';
import { map, tap, debounceTime, observeOn, distinctUntilChanged } from 'rxjs/operators';

export class CursorPosition extends Position {
  private _config: { src: HTMLElement};
  constructor(config) {
    super();
    this._config = { ...this._config, ...config };
    this.attachEvent().subscribe(); // TODO: flush on destroy
  }
  updateConfig(newConfig) {
    this._config = { ...this._config, ...newConfig };
  }
  getPositions(): PositionCoOrds {
    return { };
  }
  attachEvent() {
    return fromEvent(this._config.src, 'mousemove').pipe(
      map((e: any) => ({x: e.clientX, y: e.clientY})),
      debounceTime(1),
      observeOn(animationFrameScheduler),
      distinctUntilChanged(),
      tap(data => this.eventBus.post({name: 'NEW_DYN_POS', data})),
    );
  }
}
