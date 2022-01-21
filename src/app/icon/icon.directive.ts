import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({ selector: '[app-icon]' })
export class IconDirective implements OnChanges {
    @Input('app-icon') iconSvg: string = '';
    @Input() iconClass: string = '';
    
    constructor(
        private element: ElementRef
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['iconSvg']) {
            this.setIconSvg(changes['iconSvg'].currentValue);
        }
    }

    setIconSvg(iconSvg: string) {
        let html = iconSvg;
        if (this.iconClass) {
            html = html.replace(/class="[^"]*"/, `class="${this.iconClass}"`); 
        }
        this.element.nativeElement.innerHTML = html;
    }
}