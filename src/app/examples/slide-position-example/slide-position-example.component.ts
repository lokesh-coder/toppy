import { Component, OnInit } from '@angular/core';
import { SlidePlacement, ToppyRef, Toppy, SlidePosition } from 'toppy';
import { SimpleListComponent } from '../../host-components/simple-list/simple-list.component';

@Component({
  selector: 'app-slide-position-example',
  templateUrl: './slide-position-example.component.html',
  styles: []
})
export class SlidePositionExampleComponent implements OnInit {
  placements: { name: string; value: SlidePlacement }[] = [
    { name: 'Left', value: SlidePlacement.LEFT },
    { name: 'Right', value: SlidePlacement.RIGHT }
  ];
  selectedPlacement = null;
  private _toppyRef: ToppyRef<SimpleListComponent>;
  constructor(private toppy: Toppy<SimpleListComponent>) {}

  ngOnInit() {}

  open() {
    if (this._toppyRef) {
      this._toppyRef.close();
    }
    this._toppyRef = this.toppy
      .overlay(new SlidePosition({ placement: this.selectedPlacement }), {
        dismissOnDocumentClick: false
      })
      .host(SimpleListComponent)
      .create();
    this._toppyRef.open();
  }

  onOptionChange() {
    console.log('option changed');
  }
}
