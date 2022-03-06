import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, concat, map, of, switchMap, tap } from 'rxjs';
import { showHideBottomAnimation } from '../animations';
import { ScrollDirection } from '../common/scroll-direction';
import { icon_arrow_left, icon_plus } from '../icon/icon-set';
import { GenericPageStateObservables } from '../_models/generic-page-state-observables';
import { List } from '../_models/list';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-list-edit-page',
    templateUrl: 'list-edit-page.component.html',
    styleUrls: [ 'list-edit-page.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'},
    animations: [
        showHideBottomAnimation
    ]
})

export class ListEditPageComponent implements OnInit {
    @Input() listId: string;
    stateObservables: GenericPageStateObservables<List>;
    selectedItems: any[] = [];
    actualScrollDirection: ScrollDirection;
    ScrollDirection = ScrollDirection;
    icons = {
        arrowLeft: icon_arrow_left,
        plus: icon_plus
    };

    constructor(
        private mainData: MainDataService,
        private route: ActivatedRoute
    ) {
        this.initState();
    }

    ngOnInit(): void {
        
    }

    initState() {
        this.stateObservables = new GenericPageStateObservables<List>(
            new BehaviorSubject<boolean>(false), 
            concat(
                of(null),
                this.route.paramMap.pipe(
                    map(values => values.get('listId')),
                    tap(value => this.stateObservables.loading$.next(true)),
                    switchMap(value => this.mainData.getList(value)),
                    tap(value => value ? this.stateObservables.loading$.next(false) : null)
                )
            )
        );
    }
}