import { Component, OnInit } from '@angular/core';
import { icon_arrow_left } from '../icon/icon-set';

@Component({
    selector: 'app-search-page',
    templateUrl: 'search-page.component.html'
})

export class SearchPageComponent implements OnInit {
    icons = {
        arrowLeft: icon_arrow_left
    };
    constructor() { }

    ngOnInit() { }
}