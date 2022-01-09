import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-list-edit-page',
    templateUrl: 'list-edit-page.component.html',
    styleUrls: [ 'list-edit-page.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEditPageComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}