import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InsidePlacement } from '../../../../projects/toppy/src/lib/models';
import { GlobalPosition, Toppy, ToppyRef } from '../../../../projects/toppy/src/public_api';

@Component({
  selector: 'app-ribbon-example',
  templateUrl: './ribbon-example.component.html',
  styleUrls: ['./ribbon-example.component.scss']
})
export class RibbonExampleComponent implements OnInit {
  private _toppyRef: ToppyRef;
  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyRef = this.toppy
      .overlay(
        new GlobalPosition({
          placement: InsidePlacement.BOTTOM,
          hostWidth: '100%',
          hostHeight: 'auto'
        }),
        {
          dismissOnDocumentClick: false
        }
      )
      .host(this.tpl)
      .create();
  }
  open() {
    this._toppyRef.open();
  }
  close() {
    this._toppyRef.close();
  }
}
