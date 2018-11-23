import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalPosition, InsidePlacement, Toppy, ToppyRef } from 'toppy';
import { SimpleModalComponent } from '../../host-components/simple-modal/simple-modal.component';

@Component({
  selector: 'app-global-position-example',
  templateUrl: './global-position-example.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .global-content-wrapper {
        background: #fff;
        padding: 1rem 2rem;
        border: 2px solid #3f51b5;
        border-radius: 3px;
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
  selectedPlacement = this.placements[0].value;
  private _toppyRef: ToppyRef;
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyRef = this.toppy
      .overlay(new GlobalPosition({ placement: this.selectedPlacement, hostHeight: 'auto', hostWidth: 'auto' }), {
        docClickCallback: () => {
          console.log('doc click callback');
        },
        dismissOnDocumentClick: true,
        wrapperClass: 'global-content-wrapper',
        backdrop: true,
        bodyClassNameOnOpen: 'global-toastr'
      })
      .host(SimpleModalComponent)
      .create();
  }

  open() {
    const content = this.placements.find(a => a.value === this.selectedPlacement).name;
    this._toppyRef.updateHost(content).open();
  }

  onOptionChange() {
    this._toppyRef.updatePosition({
      placement: this.selectedPlacement
    });
  }
}
