import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    @Input() iconSvg: string;
    @Input() actionColor: string = "success";
    @Input() iconColor: string = "base-100";
    @Output() action = new EventEmitter<void>();
    currentState: string;
    actionLeftActive: boolean;
    actionRightActive: boolean;
    readonly DELTA_ACTION_ACTIVE = 120;
    readonly PAN_OFFSET = 15;

    constructor() { }

    ngOnInit() { }

    onPanMove(e: any, element: HTMLElement) {
        if (e.deltaX >= this.PAN_OFFSET || e.deltaX <= (this.PAN_OFFSET * -1) || this.currentState === 'panning') {
            if (this.currentState != 'panning')
                this.currentState='panning';
            element.style.transform = `translateX(${e.deltaX}px)`;
            this.actionLeftActive = (e.deltaX >= this.DELTA_ACTION_ACTIVE) ? true : false;
            this.actionRightActive = (e.deltaX <= (this.DELTA_ACTION_ACTIVE * -1)) ? true : false;
        }
    }

    onPanEnd(e: any, element: HTMLElement) {
        this.currentState='normal';
        if (this.actionLeftActive || this.actionRightActive)
            setTimeout(() => {
                this.action.emit();
                this.actionLeftActive = false;
                this.actionRightActive = false;
            }, 250);
        
    }
}