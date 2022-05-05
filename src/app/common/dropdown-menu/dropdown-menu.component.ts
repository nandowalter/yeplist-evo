import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-dropdown-menu',
    templateUrl: 'dropdown-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DropdownMenuComponent implements OnInit {
    @Input() dropdownMenuId: string;

    constructor() { }

    ngOnInit() { }
}