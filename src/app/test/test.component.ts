import { Component, OnInit } from '@angular/core';
import { ToppyCurrentOverlay } from 'toppy';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  constructor(private oc: ToppyCurrentOverlay) {}

  ngOnInit() {
    console.log('ID', this.oc);
  }
  close() {
    this.oc.close();
  }
}
