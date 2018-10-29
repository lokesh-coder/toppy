import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[scollspy]'
})
export class ScollSpyDirective {
  constructor(private _elRef: ElementRef, private _renderer: Renderer2) {}

  @Input()
  scollspy: string;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    console.log('scolling', this.scollspy, event);
    console.log(document.getElementById(this.scollspy));
    const elScrolled = document.getElementById(this.scollspy).offsetTop;
    const windowScolled = window.scrollY;
    if (elScrolled - windowScolled <= 0) {
      this._renderer.addClass(this._elRef.nativeElement, 'active');
    } else {
      this._renderer.removeClass(this._elRef.nativeElement, 'active');
    }
  }
}
