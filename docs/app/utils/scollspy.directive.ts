import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[scrollSpy]'
})
export class ScrollSpyDirective {
  @Input() public spiedTags = [];
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string;

  constructor(private _el: ElementRef) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    let currentSection: string;
    const children = document.querySelectorAll('h3');
    const scrollTop = document.documentElement.scrollTop;
    const parentOffset = document.documentElement.offsetTop;
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if (this.spiedTags.some(spiedTag => spiedTag === element.tagName)) {
        if (element.offsetTop - parentOffset <= scrollTop) {
          currentSection = element.id;
        }
      }
    }
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
    }
  }
}
