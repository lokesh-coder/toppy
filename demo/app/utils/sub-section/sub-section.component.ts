import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sub-section',
  templateUrl: './sub-section.component.html',
  styles: []
})
export class SubSectionComponent implements OnInit {
  @Input()
  title;
  constructor() {}

  ngOnInit() {}
}
