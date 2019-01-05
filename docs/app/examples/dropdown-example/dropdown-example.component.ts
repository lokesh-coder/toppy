import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OutsidePlacement } from '../../../../projects/toppy/src/lib/models';
import { RelativePosition, Toppy, ToppyControl } from '../../../../projects/toppy/src/public_api';

@Component({
  selector: 'app-dropdown-example',
  templateUrl: './dropdown-example.component.html',
  styleUrls: ['./dropdown-example.component.scss']
})
export class DropdownExampleComponent implements OnInit {
  @ViewChild('el') el: ElementRef;
  @ViewChild('el2') el2: ElementRef;
  private _toppyControl: ToppyControl;
  private _toppyControl2: ToppyControl;
  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;
  @ViewChild('tpl2', { read: TemplateRef }) tpl2: TemplateRef<any>;
  items = [
    { name: 'Beer', icon: 'icons8-beer-50' },
    { name: 'Coffee', icon: 'icons8-cafe-50' },
    { name: 'Cocktail', icon: 'icons8-cocktail-50' },
    { name: 'Cola', icon: 'icons8-cola-50' },
    { name: 'Tequila', icon: 'icons8-tequila-shot-50' },
    { name: 'Whiskey', icon: 'icons8-whiskey-50' }
  ];
  eatables = [
    { name: 'French fries', icon: 'icons8-french-fries-50' },
    { name: 'Fried chicken', icon: 'icons8-fried-chicken-50' },
    { name: 'Hamburger', icon: 'icons8-hamburger-50' },
    { name: 'Pizza', icon: 'icons8-pizza-50' },
    { name: 'Sandwich', icon: 'icons8-sandwich-50' }
  ];
  selectedData;
  selectedEatable;
  isOpen = false;
  constructor(private toppy: Toppy) {
    this.selectedData = this.items[0];
    this.selectedEatable = this.eatables[0];
  }

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(
        new RelativePosition({
          placement: OutsidePlacement.BOTTOM,
          src: this.el.nativeElement,
          width: '100%',
          autoUpdate: true
        })
      )
      .config({
        closeOnDocClick: true,
        docClickCallback: () => {
          this.isOpen = false;
        }
      })
      .content(this.tpl)
      .create('sonia');

    this._toppyControl2 = this.toppy
      .position(
        new RelativePosition({
          placement: OutsidePlacement.TOP,
          src: this.el2.nativeElement,
          width: 'auto',
          autoUpdate: true
        })
      )
      .config({
        docClickCallback: () => {
          this.isOpen = false;
        }
      })
      .content(this.tpl2)
      .create();
  }

  open() {
    this.isOpen = true;
    this._toppyControl.open();
  }
  open2() {
    this._toppyControl2.open();
  }
  close() {
    this.isOpen = false;
    this._toppyControl.close();
  }
  close2() {
    this._toppyControl2.close();
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
