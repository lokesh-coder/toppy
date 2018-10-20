import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToppyEvent } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventBus {
  private _event: Subject<any> = new Subject();

  post(event: ToppyEvent) {
    this._event.next(event);
  }

  watch(): Observable<any> {
    return this._event.asObservable();
  }
}
