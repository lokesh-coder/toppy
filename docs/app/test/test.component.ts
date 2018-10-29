import { Component, OnInit } from '@angular/core';
import { CurrentOverlay } from 'toppy';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  constructor(private oc: CurrentOverlay) {}

  ngOnInit() {
    console.log('ID', this.oc);
  }
  close() {
    this.oc.close();
  }
}
