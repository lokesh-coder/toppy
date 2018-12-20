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
          width: '40%',
          height: 'auto'
        })
      )
      .config({
        backdrop: true,
        closeOnDocClick: false,
        closeOnEsc: true
      })
      .content(this.modalTpl)
      .create();

    this._toppyControl2 = this.toppy
      .position(
        new GlobalPosition({
          placement: InsidePlacement.CENTER,
          width: '25%',
          height: 'auto'
        })
      )
      .config({
        closeOnEsc: true,
        closeOnDocClick: true
      })
      .content('<img src="./assets/img/blast.png" width="100%"/>', { hasHTML: true })
      .create();
  }
  open() {
    this._toppyControl.open();
  }
  openImage() {
    this._toppyControl2.open();
  }
}
