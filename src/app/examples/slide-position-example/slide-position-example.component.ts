import { Component, OnInit } from '@angular/core';
import { SlidePlacement, BlinkRef, Blink, SlidePosition } from 'blink';
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
  private _blinkRef: BlinkRef<SimpleListComponent>;
  constructor(private blink: Blink<SimpleListComponent>) {}

  ngOnInit() {}

  open() {
    if (this._blinkRef) {
      this._blinkRef.close();
    }
    this._blinkRef = this.blink
      .overlay(new SlidePosition({ placement: this.selectedPlacement }), {
        dismissOnDocumentClick: false
      })
      .host(SimpleListComponent)
      .create();
    this._blinkRef.open();
  }

  onOptionChange() {
    console.log('option changed');
  }
}
