import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalPosition, InsidePlacement, Toppy, ToppyControl } from 'toppy';
import { SimpleModalComponent } from '../../host-components/simple-modal/simple-modal.component';

@Component({
  selector: 'app-global-position-example',
  templateUrl: './global-position-example.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .global-content-wrapper {
        background: #ff5722;
        padding: 1rem 2rem;
        border: 2px solid #c4532f;
        border-radius: 3px;
        color: #fff;
        text-transform: uppercase;
        font-weight: 700;
      }
    `
  ]
})
export class GlobalPositionExampleComponent implements OnInit {
  placements: { name: string; value: InsidePlacement }[] = [
    { name: 'Bottom', value: InsidePlacement.BOTTOM },
    { name: 'Bottom left', value: InsidePlacement.BOTTOM_LEFT },
    { name: 'Bottom right', value: InsidePlacement.BOTTOM_RIGHT },
    { name: 'Left', value: InsidePlacement.LEFT },
    { name: 'Right', value: InsidePlacement.RIGHT },
    { name: 'Top', value: InsidePlacement.TOP },
    { name: 'Top left', value: InsidePlacement.TOP_LEFT },
    { name: 'Top right', value: InsidePlacement.TOP_RIGHT },
    { name: 'Center', value: InsidePlacement.CENTER }
  ];
  selectedPlacement = this.placements[8].value;
  private _toppyControl: ToppyControl;
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(
        new GlobalPosition({ placement: this.selectedPlacement, hostHeight: 'auto', hostWidth: 'auto', offset: 10 })
      )
      .config({
        docClickCallback: () => {
          console.log('doc click callback');
        },
        dismissOnDocumentClick: true,
        wrapperClass: 'global-content-wrapper',
        backdrop: true,
        bodyClassNameOnOpen: 'global-toastr'
      })
      .content(SimpleModalComponent)
      .create();
  }

  open() {
    const content = this.placements.find(a => a.value === this.selectedPlacement).name;
    this._toppyControl.updateHost(content);
    this._toppyControl.open();
  }

  onOptionChange() {
    this._toppyControl.updatePosition({
      placement: this.selectedPlacement
    });
  }
}
