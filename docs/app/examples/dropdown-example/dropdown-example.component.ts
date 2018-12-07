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
  @ViewChild('el2') el2: ElementRef;
  private _toppyRef: ToppyRef;
  private _toppyRef2: ToppyRef;
  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;
  @ViewChild('tpl2', { read: TemplateRef }) tpl2: TemplateRef<any>;
  items = [
    { name: 'giraffe', icon: 'giraffe' },
    { name: 'elephant', icon: 'elephant' },
    { name: 'bottle', icon: 'bottle' }
  ];
  eatables = [
    { name: 'Beer', icon: 'beer' },
    { name: 'Lollipop', icon: 'lollipop' },
    { name: 'Sandwich', icon: 'sandwich' },
    { name: 'Pizza', icon: 'pizza' },
    { name: 'Candy', icon: 'candy' }
  ];
  selectedData;
  selectedEatable;
  isOpen = false;
  constructor(private toppy: Toppy) {
    this.selectedData = this.items[0];
    this.selectedEatable = this.eatables[0];
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

    this._toppyRef2 = this.toppy
      .overlay(
        new RelativePosition({
          placement: OutsidePlacement.TOP,
          src: this.el2.nativeElement,
          hostWidth: 'auto',
          autoUpdate: true
        }),
        {
          docClickCallback: () => {
            this.isOpen = false;
          }
        }
      )
      .host(this.tpl2)
      .create();
  }

  open() {
    this.isOpen = true;
    this._toppyRef.open();
  }
  open2() {
    this._toppyRef2.open();
  }
  close() {
    this.isOpen = false;
    this._toppyRef.close();
  }
  close2() {
    this._toppyRef2.close();
  }
  select(item) {
    this.selectedData = item;
    this.close();
  }
  selectEatable(item) {
    this.selectedEatable = item;
    this.close2();
  }
}
