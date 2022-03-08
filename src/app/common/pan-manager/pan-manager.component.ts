import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { panXReset } from 'src/app/animations';

@Component({
    selector: 'app-pan-manager',
    templateUrl: 'pan-manager.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        panXReset
    ]
})
export class PanManagerComponent implements OnInit {
    currentState: string;
    constructor() { }

    ngOnInit() { }

    onPanStart(e: any, element: HTMLElement) {
        element.style.transform = `translateX(${e.deltaX}px)`;
    }

    onPanMove(e: any, element: HTMLElement) {
        element.style.transform = `translateX(${e.deltaX}px)`;
    }
}