import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Toppy, ToppyRef, RelativePosition, OutsidePlacement, GlobalPosition, InsidePlacement } from 'toppy';

@Component({
  selector: 'app-modal-example',
  templateUrl: './modal-example.component.html',
  styleUrls: ['./modal-example.component.scss']
})
export class ModalExampleComponent implements OnInit {
  _toppyRef: ToppyRef;
  @ViewChild('modalTpl', {read: TemplateRef})modalTpl: TemplateRef<any>;

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
  }
  open() {
    this._toppyRef.open();
  }

}
