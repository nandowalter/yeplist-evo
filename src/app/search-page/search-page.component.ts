import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { icon_arrow_left } from '../icon/icon-set';

@Component({
    selector: 'app-search-page',
    templateUrl: 'search-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-screen w-screen'}
})

export class SearchPageComponent implements OnInit {
    icons = {
        arrowLeft: icon_arrow_left
    };

    constructor() { }

    ngOnInit(): void {
        
    }
}