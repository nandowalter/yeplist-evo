import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-lists-section',
    templateUrl: 'lists-section.component.html',
    styleUrls: [ 'lists-section.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListsSectionComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}