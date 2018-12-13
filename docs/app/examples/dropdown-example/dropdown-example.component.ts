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
