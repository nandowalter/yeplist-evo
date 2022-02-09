import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScrollDirection } from './scroll-direction';

@Directive({ selector: '[app-scroll-detect]' })
export class ScrollDetectDirective implements OnInit {
    @Input() offset = 50;
    @Output() direction = new EventEmitter<ScrollDirection>();
    scrollDirection: ScrollDirection;
    prevScrollTop = 0;
    turningPoint: number;

    constructor(
        private element: ElementRef
    ) { }

    ngOnInit(): void {
        this.element.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }

    onScroll(e) {
        let scrollTop = e.currentTarget.scrollTop;

        if (((this.prevScrollTop - scrollTop) > 0) && (this.scrollDirection != ScrollDirection.up)) {
            this.turningPoint = scrollTop;
            this.scrollDirection = ScrollDirection.up;
        } else if (((this.prevScrollTop - scrollTop) <= 0) && (this.scrollDirection != ScrollDirection.down)) {
            this.turningPoint = scrollTop;
            this.scrollDirection = ScrollDirection.down;
        }

        let scrollDiff = (this.scrollDirection === ScrollDirection.up) ? (this.turningPoint - scrollTop) : (scrollTop - this.turningPoint);
        if (scrollDiff >= this.offset)
            this.direction.emit(this.scrollDirection);
        
        this.prevScrollTop = scrollTop;
    }
}