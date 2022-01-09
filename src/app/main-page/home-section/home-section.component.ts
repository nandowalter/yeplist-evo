import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-section',
    templateUrl: 'home-section.component.html',
    styleUrls: [ 'home-section.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeSectionComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}