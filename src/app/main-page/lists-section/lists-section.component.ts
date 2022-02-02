import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { combineLatestWith, map, mergeWith, switchMap, take, tap } from 'rxjs/operators';
import { listAnimations, listItemsAnimations, secondaryPageAnimations } from 'src/app/animations';
import { icon_plus, icon_trash } from 'src/app/icon/icon-set';
import { List } from 'src/app/_models/list';
import { MainDataService } from 'src/app/_services/main-data.service';

@Component({
    selector: 'app-lists-section',
    templateUrl: 'lists-section.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        secondaryPageAnimations,
        listAnimations,
        listItemsAnimations
    ]
})
export class ListsSectionComponent {
    icons = {
        trash: icon_trash,
        plus: icon_plus
    };
    loading$ = new BehaviorSubject<boolean>(false);
    data$: Observable<List[] | null>;
    state$: Observable<{ loading: boolean, data: List[] | null }>;
    
    constructor(
        private mainData: MainDataService
    ) {
        this.initState();
    }

    initState() {
        this.data$ = of(null).pipe(
            tap(value => this.loading$.next(true)),
            mergeWith(this.mainData.data),
            tap(value => value ? this.loading$.next(false) : null)
        );
        this.state$ = this.loading$.pipe(
            combineLatestWith(this.data$),
            map(value => ({ loading: value[0], data: value[1] }))
        );
    }

    deleteList(id?: string) {
        if (!id)
            return;

        of(id).pipe(
            tap(value => this.loading$.next(true)),
            switchMap(value => this.mainData.deleteList(id as string)),
            tap(value => this.loading$.next(false)),
            take(1)
        ).subscribe();
    }

    trackById(index: number, item: List) {
        return item.id;
    }

    itemPress() {
        window.alert('pressed');
    }
}