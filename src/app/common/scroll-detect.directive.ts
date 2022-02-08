import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({ selector: '[app-scroll-detect]' })
export class ScrollDetectDirective implements OnInit {
    constructor(
        private element: ElementRef
    ) { }

    ngOnInit(): void {
        this.element.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }

    scrollDirection: string;
    oldScroll: number;
    onScroll() {
        console.log(`${this.oldScroll > this.element.nativeElement.scrollY} - ${this.element.nativeElement.scrollY}` );
        this.oldScroll = this.element.nativeElement.scrollY;
    }
}