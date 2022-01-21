import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { icon_heart, icon_star } from 'src/app/icon/icon-set';

@Component({
    selector: 'app-home-section',
    templateUrl: 'home-section.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeSectionComponent implements OnInit {
    icons = {
        star: icon_star,
        heart: icon_heart
    };

    constructor() { }

    ngOnInit() { }
}