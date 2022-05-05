import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-modal-dialog',
    templateUrl: 'modal-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ModalDialogComponent implements OnInit {
    @Input() modalId: string;
    @Input() cancelButton: boolean;
    @Input() confirmButton: boolean;

    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();

    constructor() { }

    ngOnInit() { }

    onCancel() {
        this.cancel.emit();
    }

    onConfirm() {
        this.confirm.emit();
    }
}