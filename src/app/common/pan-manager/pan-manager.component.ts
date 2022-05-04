import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { panXReset } from 'src/app/animations';

@Component({
    selector: 'app-pan-manager',
    templateUrl: 'pan-manager.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        panXReset
    ]
})
export class PanManagerComponent implements OnInit {
    @Input() iconSvg: string;
    @Input() actionColor: string = "success";
    @Input() iconColor: string = "base-100";
    @Input() disabled: boolean;
    @Output() action = new EventEmitter<void>();
    @Output() panStarted = new EventEmitter();
    @Output() panEnded = new EventEmitter();
    currentState: string;
    actionLeftActive: boolean;
    actionRightActive: boolean;
    readonly DELTA_ACTION_ACTIVE = 120;
    readonly PAN_OFFSET = 15;

    constructor() { }

    ngOnInit() { }

    onPanMove(e: any, element: HTMLElement) {
        if (!this.disabled && (e.deltaX >= this.PAN_OFFSET || e.deltaX <= (this.PAN_OFFSET * -1) || this.currentState === 'panning')) {
            if (this.currentState != 'panning') {
                this.panStarted.emit();
                this.currentState='panning';
            }
            element.style.transform = `translateX(${e.deltaX}px)`;
            this.actionLeftActive = (e.deltaX >= this.DELTA_ACTION_ACTIVE) ? true : false;
            this.actionRightActive = (e.deltaX <= (this.DELTA_ACTION_ACTIVE * -1)) ? true : false;
        }
    }

    onPanEnd(e: any, element: HTMLElement) {
        this.panEnded.emit();
        this.currentState='normal';
        if (this.actionLeftActive || this.actionRightActive)
            setTimeout(() => {
                this.action.emit();
                this.actionLeftActive = false;
                this.actionRightActive = false;
            }, 150);
        
    }
}