import { Component, OnInit } from '@angular/core';
import { BlinkCurrentOverlay } from 'blink';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  constructor(private oc: BlinkCurrentOverlay) {}

  ngOnInit() {
    console.log('ID', this.oc);
  }
  close() {
    this.oc.close();
  }
}
