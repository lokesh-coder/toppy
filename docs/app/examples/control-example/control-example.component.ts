import { Component, OnInit } from '@angular/core';
import { Toppy } from '../../../../projects/toppy/src/lib/toppy';

@Component({
  selector: 'app-control-example',
  templateUrl: './control-example.component.html',
  styleUrls: ['./control-example.component.scss']
})
export class ControlExampleComponent implements OnInit {
  constructor(private toppy: Toppy) {}

  ngOnInit() {}
  open() {
    this.toppy.getCtrl('sonia').open();
  }
}
