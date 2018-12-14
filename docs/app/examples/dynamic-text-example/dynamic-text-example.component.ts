import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as format from 'date-fns/format';
import { never, Observable, Subject, timer } from 'rxjs';
import { map, switchMap, timeInterval } from 'rxjs/operators';
import { OutsidePlacement } from '../../../../projects/toppy/src/lib/models';
import { RelativePosition, Toppy, ToppyControl } from '../../../../projects/toppy/src/public_api';

@Component({
  selector: 'app-dynamic-text-example',
  templateUrl: './dynamic-text-example.component.html'
})
export class DynamicTextExampleComponent implements OnInit {
  @ViewChild('el') el: ElementRef;
  private _toppyControl: ToppyControl;
  pauser = new Subject();
  constructor(private toppy: Toppy) {
    this.pauser.pipe(switchMap(paused => (paused ? never() : this.source()))).subscribe(x => console.log(x));
  }

  source(): Observable<Date> {
    return new Observable(observer => {
      timer(0, 100)
        .pipe(
          timeInterval(),
          map(() => this._toppyControl.updateTextContent.next(this.formatedTime()))
        )
        .subscribe();
    });
  }

  formatedTime() {
    return format(new Date(), 'HH:mm:ss A');
  }

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(
        new RelativePosition({
          placement: OutsidePlacement.RIGHT,
          src: this.el.nativeElement,
          width: 'auto',
          autoUpdate: true
        })
      )
      .content(this.formatedTime(), { class: 'tooltip' })
      .create();
  }

  onMouseOver() {
    this._toppyControl.open();
    this.pauser.next(false);
  }
  onMouseLeave() {
    this._toppyControl.close();
    this.pauser.next(true);
  }
}
