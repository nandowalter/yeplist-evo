import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { icon_check_circle, icon_chevron_right, icon_users } from 'src/app/icon/icon-set';
import { List } from 'src/app/_models/list';
import { ListEntryMode } from '../list-entry-mode';

@Component({
    selector: 'app-list-entry',
    templateUrl: 'list-entry.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEntryComponent {
    @Input() set list(value: List) {
        this._list = value;
        this.cd.markForCheck();
    };
    _list: List;
    @Input() selected: boolean;
    @Input() mode: ListEntryMode;
    @Output() entryPress = new EventEmitter<string>();
    @Output() entryTap = new EventEmitter<string>();
    ListEntryMode = ListEntryMode;
    icons = {
        chevron_right: icon_chevron_right,
        check_circle: icon_check_circle,
        users: icon_users
    };

    constructor(private cd: ChangeDetectorRef) { }

    onTap(listId: string) {
        this.entryTap.emit(listId);
    }

    onPress(listId: string) {
        this.entryPress.emit(listId);
    }
}