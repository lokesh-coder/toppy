import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
// import { Toppy } from 'toppy';
import { code } from './codes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  latestVersion = '';
  versions = [];
  title = 'toppy-app';
  selectedVersion = '';
  @ViewChild('el', { read: ElementRef })
  el: ElementRef;
  ins;
  code = code;
  constructor(private http: HttpClient) {
    this.http.get('./assets/archived-versions.json').subscribe(data => {
      this.versions = Object.keys(data)
        .filter(a => a !== 'undefined')
        .sort((a, b) => ('' + b).localeCompare(a));
      this.latestVersion = this.versions[0];
      this.getCurrentVerison();
    });
  }

  ngafterViewInit() {
    this.getCurrentVerison();
  }

  getCurrentVerison() {
    const parts = window.location.pathname.split('/').filter(a => a.length > 0);
    if (parts.length === 2) {
      this.selectedVersion = parts[1];
    } else {
      this.selectedVersion = this.latestVersion;
    }
  }

  onVersionChange(version) {
    (window as any).location = `https://lokesh-coder.github.io/toppy/${version}`;
  }
}