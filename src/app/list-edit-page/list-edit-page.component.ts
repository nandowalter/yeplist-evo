import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { icon_arrow_left } from '../icon/icon-set';
import { GenericPageStateObservables } from '../_models/generic-page-state-observables';
import { List } from '../_models/list';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-list-edit-page',
    templateUrl: 'list-edit-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEditPageComponent implements OnInit {
    @Input() listId: string;
    stateObservables: GenericPageStateObservables<List>;
    icons = {
        arrowLeft: icon_arrow_left
    };

    constructor(
        private mainData: MainDataService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initState();
    }

    initState() {
        this.stateObservables = new GenericPageStateObservables<List>(
            new BehaviorSubject<boolean>(false), 
            this.route.paramMap.pipe(
                map(values => values.get('listId')),
                tap(value => this.stateObservables.loading$.next(true)),
                switchMap(value => this.mainData.getList(value)),
                tap(value => value ? this.stateObservables.loading$.next(false) : null)
            )
        );
    }
}