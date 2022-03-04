import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { icon_check_circle, icon_chevron_right, icon_plus, icon_trash } from 'src/app/icon/icon-set';
import { List } from 'src/app/_models/list';
import { ListEntryMode } from './list-entry-mode';

@Component({
    selector: 'app-list-entry',
    templateUrl: 'list-entry.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEntryComponent {
    @Input() list: List;
    @Input() selected: boolean;
    @Input() mode: ListEntryMode;
    @Output() entryPress = new EventEmitter<string>();
    @Output() entryTap = new EventEmitter<string>();
    ListEntryMode = ListEntryMode;
    icons = {
        chevron_right: icon_chevron_right,
        check_circle: icon_check_circle
    };

    constructor() { }

    onTap(listId: string) {
        this.entryTap.emit(listId);
    }

    onPress(listId: string) {
        this.entryPress.emit(listId);
    }
}