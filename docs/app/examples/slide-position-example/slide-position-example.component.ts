import { Component, OnInit } from '@angular/core';
import { SlidePlacement, SlidePosition, Toppy, ToppyControl } from 'toppy';
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
  selectedPlacement = this.placements[0].value;
  private _toppyControl: ToppyControl;
  constructor(private toppy: Toppy) {}

  ngOnInit() {}

  open() {
    if (this._toppyControl) {
      this._toppyControl.close();
    }
    this._toppyControl = this.toppy
      .position(new SlidePosition({ placement: this.selectedPlacement }))
      .config({
        dismissOnDocumentClick: true
      })
      .content(SimpleListComponent)
      .create();
    this._toppyControl.open();
  }

  onOptionChange() {
    console.log('option changed');
  }
}
