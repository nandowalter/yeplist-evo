import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { icon_exclamation_circle } from '../icon/icon-set';
import { AlertType } from './alert-type';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AlertComponent implements OnInit {
    @Input() alertType: AlertType = AlertType.success;
    icons = {
        exclamationCircle: icon_exclamation_circle
    };

    constructor() { }

    ngOnInit() { }
}