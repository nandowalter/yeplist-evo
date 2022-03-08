import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { icon_check_circle, icon_chevron_right } from 'src/app/icon/icon-set';
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
    icons = {
        chevron_right: icon_chevron_right,
        check_circle: icon_check_circle
    };
    ListEntryMode = ListEntryMode;

    constructor() { }

    ngOnInit() { }

    onTap(itemId: string) {}
    onPress(itemId: string) {}
}