import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GlobalPosition, InsidePlacement, Toppy, ToppyControl } from 'toppy';

@Component({
  selector: 'app-modal-example',
  templateUrl: './modal-example.component.html',
  styleUrls: ['./modal-example.component.scss']
})
export class ModalExampleComponent implements OnInit {
  _toppyControl: ToppyControl;
  _toppyControl2: ToppyControl;
  @ViewChild('modalTpl', { read: TemplateRef }) modalTpl: TemplateRef<any>;

  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(
        new GlobalPosition({
          placement: InsidePlacement.CENTER,
          hostWidth: '40%',
          hostHeight: 'auto'
        })
      )
      .config({
        backdrop: true,
        dismissOnDocumentClick: false,
        closeOnEsc: true
      })
      .content(this.modalTpl)
      .execute();

    this._toppyControl2 = this.toppy
      .position(
        new GlobalPosition({
          placement: InsidePlacement.CENTER,
          hostWidth: '25%',
          hostHeight: 'auto'
        })
      )
      .config({
        closeOnEsc: true
      })
      .content('<img src="./assets/svg/giraffe.svg"/>', { hasHTML: true })
      .execute();
  }
  open() {
    this._toppyControl.open();
  }
  openImage() {
    this._toppyControl2.open();
  }
}
