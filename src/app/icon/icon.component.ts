import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-icon',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IconComponent implements OnChanges {
    @Input() iconSvg: string = '';
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