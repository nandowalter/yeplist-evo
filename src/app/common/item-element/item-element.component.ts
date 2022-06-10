import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { icon_check_circle, icon_chevron_right, icon_dots_horizontal } from 'src/app/icon/icon-set';
import { ListEntryMode } from '../list-entry-mode';

@Component({
    selector: 'app-item-element',
    templateUrl: 'item-element.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ItemElementComponent implements OnInit {
    @Input() item: any;
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

    ngOnInit() { }

    onTap(itemId: string) {}
    onPress(itemId: string) {}

    onContextBtnClick() {
        this.contextBtnClick.emit();
    }
}