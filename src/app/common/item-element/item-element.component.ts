import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { icon_check_circle, icon_chevron_right, icon_dots_horizontal } from 'src/app/icon/icon-set';
import { ListItem } from 'src/app/_models/list-item';
import { ListEntryMode } from '../list-entry-mode';

@Component({
    selector: 'app-item-element',
    templateUrl: 'item-element.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ItemElementComponent {
    @Input() item: ListItem;
    @Input() mode: ListEntryMode;
    @Input() selected: boolean;
    @Input() showQty = true;
    @Input() contextButton = false;
    @Output() contextBtnClick = new EventEmitter<void>();
    icons = {
        chevron_right: icon_chevron_right,
        check_circle: icon_check_circle,
        dots_horizontal: icon_dots_horizontal
    };
    ListEntryMode = ListEntryMode;

    constructor() { }

    onContextBtnClick() {
        this.contextBtnClick.emit();
    }

    getImageCompleteUrl(imageUrl: string) {
        return `https://firebasestorage.googleapis.com/v0/b/yeplist-evo.appspot.com/o/${encodeURIComponent(imageUrl)}?alt=media`;
    }

    getNameMark(name: string) {
        return name.split(' ').map(i => i[0]).slice(0,2).join('');
    }
}