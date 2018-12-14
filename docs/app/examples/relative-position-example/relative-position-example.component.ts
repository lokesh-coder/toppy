import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { OutsidePlacement, RelativePosition, Toppy } from 'toppy';
import { ToppyControl } from '../../../../projects/toppy/src/lib/toppy-control';

@Component({
  selector: 'app-relative-position-example',
  templateUrl: './relative-position-example.component.html',
  styles: [],
  providers: [Toppy]
})
export class RelativePositionExampleComponent implements OnInit {
  @ViewChild('targetEl', { read: ElementRef })
  targetEl: ElementRef;

  placements: { name: string; value: OutsidePlacement }[] = [
    { name: 'Bottom', value: OutsidePlacement.BOTTOM },
    { name: 'Bottom left', value: OutsidePlacement.BOTTOM_LEFT },
    { name: 'Bottom right', value: OutsidePlacement.BOTTOM_RIGHT },
    { name: 'Left', value: OutsidePlacement.LEFT },
    { name: 'Left bottom', value: OutsidePlacement.LEFT_BOTTOM },
    { name: 'Left top', value: OutsidePlacement.LEFT_TOP },
    { name: 'Right', value: OutsidePlacement.RIGHT },
    { name: 'Right bottom', value: OutsidePlacement.RIGHT_BOTTOM },
    { name: 'Right top', value: OutsidePlacement.RIGHT_TOP },
    { name: 'Top', value: OutsidePlacement.TOP },
    { name: 'Top left', value: OutsidePlacement.TOP_LEFT },
    { name: 'Top right', value: OutsidePlacement.TOP_RIGHT }
  ];
  selectedPlacement = this.placements[0].value;
  private _toppyControl: ToppyControl;
  destroy$ = new Subject();
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(
        new RelativePosition({
          placement: this.selectedPlacement,
          src: this.targetEl.nativeElement,
          width: 'auto',
          autoUpdate: true
        })
      )
      .content('hello')
      .create();
  }

  onOptionChange() {
    this._toppyControl.updatePosition({
      placement: this.selectedPlacement
    });
  }
  onMouseOver() {
    const content = this.placements.find(a => a.value === this.selectedPlacement).name;
    this._toppyControl.updateContent(content, { class: 'tooltip' });
    this._toppyControl.open();
  }
  onMouseLeave() {
    this._toppyControl.close();
  }
}
