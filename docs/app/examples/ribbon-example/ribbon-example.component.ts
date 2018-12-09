import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InsidePlacement } from '../../../../projects/toppy/src/lib/models';
import { GlobalPosition, Toppy, ToppyControl } from '../../../../projects/toppy/src/public_api';

@Component({
  selector: 'app-ribbon-example',
  templateUrl: './ribbon-example.component.html',
  styleUrls: ['./ribbon-example.component.scss']
})
export class RibbonExampleComponent implements OnInit {
  private _toppyControl: ToppyControl;
  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(
        new GlobalPosition({
          placement: InsidePlacement.BOTTOM,
          hostWidth: '100%',
          hostHeight: 'auto'
        })
      )
      .config({
        dismissOnDocumentClick: false
      })
      .content(this.tpl)
      .create();
  }
  open() {
    this._toppyControl.open();
  }
  close() {
    this._toppyControl.close();
  }
}
