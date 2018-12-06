import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import format from 'date-fns/format';
import { never, Observable, Subject, timer } from 'rxjs';
import { map, switchMap, timeInterval } from 'rxjs/operators';
import { OutsidePlacement } from '../../../../projects/toppy/src/lib/models';
import { RelativePosition, Toppy, ToppyRef } from '../../../../projects/toppy/src/public_api';

@Component({
  selector: 'app-dynamic-text-example',
  templateUrl: './dynamic-text-example.component.html'
})
export class DynamicTextExampleComponent implements OnInit {
  @ViewChild('el') el: ElementRef;
  private _toppyRef: ToppyRef;
  pauser = new Subject();
  constructor(private toppy: Toppy) {
    this.pauser.pipe(switchMap(paused => (paused ? never() : this.source()))).subscribe(x => console.log(x));
  }

  source(): Observable<Date> {
    return new Observable(observer => {
      timer(0, 100)
        .pipe(
          timeInterval(),
          map(() => this._toppyRef.updateTextContent.next(this.formatedTime()))
        )
        .subscribe();
    });
  }

  formatedTime() {
    return format(new Date(), 'HH:mm:ss A');
  }

  ngOnInit() {
    this._toppyRef = this.toppy
      .overlay(
        new RelativePosition({
          placement: OutsidePlacement.RIGHT_TOP,
          src: this.el.nativeElement,
          hostWidth: 'auto',
          autoUpdate: true
        }),
        {
          isHover: true
        }
      )
      .host(this.formatedTime(), { class: 'tooltip' })
      .create();
  }

  onMouseOver() {
    this._toppyRef.open();
    this.pauser.next(false);
  }
  onMouseLeave() {
    this._toppyRef.close();
    this.pauser.next(true);
  }
}
