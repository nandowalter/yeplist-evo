import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, Subscription } from 'rxjs';
import { NavbarCommand } from 'src/app/_models/navbar-command';
import { NavbarModeService } from 'src/app/_services/navbar-mode.service';
import { ListEntryMode } from '../../common/list-entry-mode';
import { icon_arrow_left, icon_collection, icon_pencil } from '../../icon/icon-set';
import { List } from '../../_models/list';
import { ListItem } from '../../_models/list-item';
import { MainDataService } from '../../_services/main-data.service';

@Component({
    selector: 'app-search-section',
    templateUrl: 'search-section.component.html',
    styleUrls: [ 'search-section.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchSectionComponent implements OnInit, OnDestroy {
    activePanel: number;
    lists$ = new BehaviorSubject<List[]>(null);
    items$ = new BehaviorSubject<{ list: List, item: ListItem }[]>(null);
    state$: Observable<{ lists: List[], itemsInLists: { list: List, item: ListItem }[] }>;
    ListEntryMode = ListEntryMode;
    navbarMode$$: Subscription;

    icons = {
        arrow_left: icon_arrow_left,
        collection: icon_collection,
        pencil: icon_pencil
    };

    constructor(
        private mainData: MainDataService,
        private router: Router,
        private route: ActivatedRoute,
        private navbarModeService: NavbarModeService
    ) {
        this.state$ = combineLatest([
            this.lists$,
            this.items$
        ]).pipe(
            map(value => ({ lists: value[0], itemsInLists: value[1] }))
        );
    }

    ngOnInit(): void {
        this.navbarMode$$ = this.navbarModeService.command.subscribe({
            next: (navbarCommand: { command: NavbarCommand, value?: string}) => this.onSearchText(navbarCommand.value)
        });
    }

    ngOnDestroy(): void {
        if (this.navbarMode$$)
            this.navbarMode$$.unsubscribe();
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