import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-dropdown-menu',
    templateUrl: 'dropdown-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DropdownMenuComponent {
    @Input() dropdownMenuId: string;

    constructor() { }
}