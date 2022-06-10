import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, Subject } from 'rxjs';
import { ListEntryMode } from '../common/list-entry-mode';
import { icon_arrow_left, icon_collection, icon_pencil } from '../icon/icon-set';
import { List } from '../_models/list';
import { ListItem } from '../_models/list-item';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-search-page',
    templateUrl: 'search-page.component.html',
    styleUrls: [ 'search-page.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'}
})

export class SearchPageComponent implements OnInit, AfterViewInit {
    @ViewChild('searchInput') searchInput: ElementRef;
    activePanel: number;
    dataGroup: FormGroup;
    lists$ = new BehaviorSubject<List[]>(null);
    items$ = new BehaviorSubject<{ list: List, item: ListItem }[]>(null);
    state$: Observable<{ lists: List[], itemsInLists: { list: List, item: ListItem }[] }>;
    ListEntryMode = ListEntryMode;

    icons = {
        arrow_left: icon_arrow_left,
        collection: icon_collection,
        pencil: icon_pencil
    };

    constructor(
        private mainData: MainDataService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.state$ = combineLatest([
            this.lists$,
            this.items$
        ]).pipe(
            map(value => ({ lists: value[0], itemsInLists: value[1] }))
        );
    }

    ngOnInit(): void {
        this.initForm();
    }

    ngAfterViewInit(): void {
        this.searchInput.nativeElement.focus();
    }

    trackListsById(index: number, item: List) {
        return item.id;
    }

    onListItemTap(index: number, listId: string) {
        this.router.navigate(['..', 'list', 'edit', listId], { relativeTo: this.route });
    }

    goToList(list: List) {
        this.router.navigate(['..', 'list', 'edit', list.id], { relativeTo: this.route });
    }

    goToItemInList(list: List, item: ListItem) {
        this.router.navigate(['..', 'list', 'edit', list.id, 'item', item.id], { relativeTo: this.route });
    }

    private initForm() {
        this.dataGroup = new FormGroup({
            searchText: new FormControl(null)
        });

        this.dataGroup.controls['searchText'].valueChanges.pipe(debounceTime(500)).subscribe(value => this.onSearchText(value));
    }

    private onSearchText(searchText: string) {
        if (!searchText || searchText.length === 0) {
            this.lists$.next(null);
        } else {
            this.mainData.findLists(searchText).then(value => {
                this.lists$.next(value);
            });

            this.mainData.findItemsInLists(searchText).pipe(
                map(value => value?.length > 0 ? value.map(l => ({ list: l, item: l.items.find(i => i.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) })) : [])
            ).subscribe({
                next: (value) => this.items$.next(value)
            });
        }
    }
}