import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { TOPPY_VERSION } from '../environments/version';
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
  currentVersion = TOPPY_VERSION;
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
  currentSection = '';

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    this.currentSection = section;
    document.querySelector('#' + section).scrollIntoView();
  }

  ngOnInit() {
    this.onScroll();
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

  onScroll() {
    fromEvent(window, 'scroll')
      .pipe()
      .subscribe(res => {
        const heroHeight = document.querySelector('.hero').getBoundingClientRect().height;
        const scrolledTo = document.documentElement.scrollTop;
        if (scrolledTo >= heroHeight) {
          document.querySelector('body').classList.add('sidebar-fixed');
        } else {
          document.querySelector('body').classList.remove('sidebar-fixed');
        }
      });
  }

  tweet(e) {
    const getWindowOptions = function() {
      const width = 500;
      const height = 350;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      return ['resizable,scrollbars,status', 'height=' + height, 'width=' + width, 'left=' + left, 'top=' + top].join();
    };
    // const text = encodeURIComponent('Hey everyone, come & see how good I look!');
    const shareUrl = `https://twitter.com/intent/tweet?hashtags=angular&original_referer=http%3A%2F%2Flocalhost%3A4200%2F&ref_src=twsrc%5Etfw&text=Cute%20overlay%20library%20for%20Angular%20-%20tooltips%2C%20modals%2C%20toastr%2C%20menu%2C%20dropdowns%2C%20alerts%2C%20popovers%2C%20sidebar%20and%20more...%20&tw_p=tweetbutton&url=https%3A%2F%2Flokesh-coder.github.io%2Ftoppy%2F&via=lokesh_coder`;

    e.preventDefault();
    const win = window.open(shareUrl, 'ShareOnTwitter', getWindowOptions());
    win.opener = null; // 2
  }
}
