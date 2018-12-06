import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GlobalPosition, InsidePlacement, Toppy, ToppyRef } from 'toppy';

@Component({
  selector: 'app-modal-example',
  templateUrl: './modal-example.component.html',
  styleUrls: ['./modal-example.component.scss']
})
export class ModalExampleComponent implements OnInit {
  _toppyRef: ToppyRef;
  _toppyRef2: ToppyRef;
  @ViewChild('modalTpl', { read: TemplateRef }) modalTpl: TemplateRef<any>;

  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyRef = this.toppy
      .overlay(
        new GlobalPosition({
          placement: InsidePlacement.CENTER,
          hostWidth: '40%',
          hostHeight: 'auto'
        }),
        {
          backdrop: true,
          dismissOnDocumentClick: false,
          closeOnEsc: true
        }
      )
      .host(this.modalTpl)
      .create();

    this._toppyRef2 = this.toppy
      .overlay(
        new GlobalPosition({
          placement: InsidePlacement.CENTER,
          hostWidth: '25%',
          hostHeight: 'auto'
        }),
        {
          closeOnEsc: true
        }
      )
      .host('<img src="./assets/svg/giraffe.svg"/>', { hasHTML: true })
      .create();
  }
  open() {
    this._toppyRef.open();
  }
  openImage() {
    this._toppyRef2.open();
  }
}
