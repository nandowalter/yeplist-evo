import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, concat, map, of, switchMap, tap } from 'rxjs';
import { rotateInOutAnimation, showHideBottomAnimation } from '../animations';
import { ScrollDirection } from '../common/scroll-direction';
import { icon_arrow_left, icon_check, icon_clipboard_check, icon_plus, icon_reply, icon_trash, icon_x } from '../icon/icon-set';
import { GenericPageStateObservables } from '../_models/generic-page-state-observables';
import { List } from '../_models/list';
import { ListItem } from '../_models/list-item';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-list-edit-page',
    templateUrl: 'list-edit-page.component.html',
    styleUrls: [ 'list-edit-page.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'},
    animations: [
        showHideBottomAnimation,
        rotateInOutAnimation
    ]
})

export class ListEditPageComponent implements OnInit {
    stateObservables: GenericPageStateObservables<List>;
    selectedItems: any[] = [];
    actualScrollDirection: ScrollDirection;
    ScrollDirection = ScrollDirection;
    icons = {
        arrowLeft: icon_arrow_left,
        plus: icon_plus,
        check: icon_check,
        reply: icon_reply,
        x: icon_x,
        trash: icon_trash,
        clipboardCheck: icon_clipboard_check
    };

    constructor(
        private cd: ChangeDetectorRef,
        private mainData: MainDataService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.initState();
    }

    ngOnInit(): void {
        
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

    markItem(listId: string, item: ListItem) {
        this.mainData.updateItem(listId, item.patch({ marked: item.marked ? false : true })).subscribe();
    }

    onItemTap(itemId: string) {
        if (this.selectedItems.length === 0) {
            this.router.navigate(['item', itemId], { relativeTo: this.route });
        } else {
            this.selectedItems.indexOf(itemId) === -1 ? this.selectedItems.push(itemId) : this.selectedItems.splice(this.selectedItems.indexOf(itemId), 1);
        }
    }

    onItemPress(itemId: string) {
        this.selectedItems.indexOf(itemId) === -1 ? this.selectedItems.push(itemId) : this.selectedItems.splice(this.selectedItems.indexOf(itemId), 1);
    }

    unselectAll() {
        this.selectedItems = [];
    }

    canMarkSelected(selectedItems: string[], items: ReadonlyArray<ListItem>) {
        return selectedItems.findIndex(itemId => items.findIndex(i => (i.id === itemId) && !i.marked) > -1) > -1;
    }

    deleteSelected(listId: string, selectedItems: string[], items: ReadonlyArray<ListItem>) {
        this.stateObservables.loading$.next(true);
        this.mainData.deleteItems(listId, items.filter(i => selectedItems.indexOf(i.id) > -1)).subscribe({ complete: () => {
            this.unselectAll();
            this.stateObservables.loading$.next(false);
        }});
    }

    markSelected(listId: string, selectedItems: string[], items: ReadonlyArray<ListItem>) {
        this.stateObservables.loading$.next(true);
        let itemsToUpdate = items.filter(i => selectedItems.indexOf(i.id) > -1).map(i => i.patch({ marked: true }));
        this.mainData.updateItems(listId, itemsToUpdate).subscribe({ complete: () => {
            this.unselectAll();
            this.stateObservables.loading$.next(false);
        }});
    }
}