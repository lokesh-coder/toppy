import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Blink, RelativePosition, OutsidePlacement, BlinkRef } from 'blink';
import { TooltipComponent } from '../../host-components/tooltip/tooltip.component';

@Component({
  selector: 'app-relative-position-example',
  templateUrl: './relative-position-example.component.html',
  styles: []
})
export class RelativePositionExampleComponent implements OnInit {
  @ViewChild('targetEl', { read: ElementRef })
  targetEl: ElementRef;
  @ViewChild('content', { read: TemplateRef })
  content: TemplateRef<any>;
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
  selectedPlacement = null;
  private _blinkRef: BlinkRef<TooltipComponent>;
  constructor(private blink: Blink<TooltipComponent>) {}

  ngOnInit() {}

  onOptionChange() {
    console.log('option changed');
    if (this._blinkRef) {
      this._blinkRef.close();
    }
    this._blinkRef = this.blink
      .overlay(
        new RelativePosition({
          placement: this.selectedPlacement,
          src: this.targetEl.nativeElement,
          hostWidth: 'auto',
          autoUpdate: true
        })
      )
      .host(this.content)
      // .textContent('lokesh__')
      // .htmlContent(`Hello <b>Lokesh</b>!`)
      .create();
    this._blinkRef.open();
  }
}
