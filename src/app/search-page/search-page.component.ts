import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, Subject } from 'rxjs';
import { ListEntryMode } from '../common/list-entry/list-entry-mode';
import { icon_arrow_left } from '../icon/icon-set';
import { List } from '../_models/list';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-search-page',
    templateUrl: 'search-page.component.html',
    styleUrls: [ 'search-page.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-screen w-screen'}
})

export class SearchPageComponent implements OnInit, AfterViewInit {
    @ViewChild('searchInput') searchInput: ElementRef;
    activePanel: number;
    dataGroup: FormGroup;
    lists$ = new BehaviorSubject<List[]>(null);
    state$: Observable<{ lists: List[] }>;
    ListEntryMode = ListEntryMode;

    icons = {
        arrowLeft: icon_arrow_left
    };

    constructor(
        private mainData: MainDataService
    ) {
        this.state$ = combineLatest([
            this.lists$
        ]).pipe(
            map(value => ({ lists: value[0] }))
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
        }
    }
}