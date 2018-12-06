import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OutsidePlacement } from '../../../../projects/toppy/src/lib/models';
import { RelativePosition, Toppy, ToppyRef } from '../../../../projects/toppy/src/public_api';

@Component({
  selector: 'app-dropdown-example',
  templateUrl: './dropdown-example.component.html',
  styleUrls: ['./dropdown-example.component.scss']
})
export class DropdownExampleComponent implements OnInit {
  @ViewChild('el') el: ElementRef;
  private _toppyRef: ToppyRef;
  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;
  items = [
    { name: 'giraffe', icon: 'giraffe' },
    { name: 'elephant', icon: 'elephant' },
    { name: 'bottle', icon: 'bottle' }
  ];
  selectedData;
  isOpen = false;
  constructor(private toppy: Toppy) {
    this.selectedData = this.items[0];
  }

  ngOnInit() {
    this._toppyRef = this.toppy
      .overlay(
        new RelativePosition({
          placement: OutsidePlacement.BOTTOM,
          src: this.el.nativeElement,
          hostWidth: '100%',
          autoUpdate: true
        }),
        {
          isHover: false,
          docClickCallback: () => {
            this.isOpen = false;
          }
        }
      )
      .host(this.tpl)
      .create();
  }

  open() {
    this.isOpen = true;
    this._toppyRef.open();
  }
  close() {
    this.isOpen = false;
    this._toppyRef.close();
  }
  select(item) {
    this.selectedData = item;
    this.close();
  }
}
