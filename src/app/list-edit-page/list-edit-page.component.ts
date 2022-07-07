import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { rotateInOutAnimation, showHideBottomAnimation } from '../animations';
import { ScrollDirection } from '../common/scroll-direction';
import { icon_arrow_left, icon_check, icon_clipboard_check, icon_cog, icon_dots_horizontal, icon_dots_vertical, icon_plus, icon_reply, icon_share, icon_trash, icon_x } from '../icon/icon-set';
import { List } from '../_models/list';
import { ListItem } from '../_models/list-item';
import { MainDataService } from '../_services/main-data.service';
import { ListEditState, ListEditStore } from './list-edit.store';

@Component({
    selector: 'app-list-edit-page',
    templateUrl: 'list-edit-page.component.html',
    styleUrls: [ 'list-edit-page.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'},
    providers: [
        ListEditStore
    ],
    animations: [
        showHideBottomAnimation,
        rotateInOutAnimation
    ]
})
export class ListEditPageComponent implements OnInit, OnDestroy {
    state$: Observable<ListEditState>;
    actualScrollDirection: ScrollDirection;
    ScrollDirection = ScrollDirection;
    icons = {
        arrow_left: icon_arrow_left,
        plus: icon_plus,
        check: icon_check,
        reply: icon_reply,
        x: icon_x,
        trash: icon_trash,
        clipboard_check: icon_clipboard_check,
        dots_vertical: icon_dots_vertical,
        dots_horizontal: icon_dots_horizontal,
        cog: icon_cog,
        share: icon_share
    };
    itemPanning: boolean;

    constructor(
        public auth: Auth,
        private route: ActivatedRoute,
        private router: Router,
        private pageStore: ListEditStore,
        private dataService: MainDataService
    ) {
        this.state$ = this.pageStore.state$;
    }

    ngOnInit(): void {
        this.pageStore.getList(
            this.route.paramMap.pipe(
                take(1),
                map(values => values.get('listId')),
                tap(listId => {
                    if (typeof localStorage != 'undefined') {
                        localStorage.setItem('yp_lastEditedListId', listId);
                    }
                })
            )
        );
    }

    ngOnDestroy(): void {
        if (typeof localStorage != 'undefined') {
            localStorage.removeItem('yp_lastEditedListId');
        }
    }

    markItem(listId: string, item: ListItem) {
        this.pageStore.updateItems({ listId, items: [item.patch({ marked: item.marked ? false : true })] });
    }

    onItemTap(itemId: string, selectedItemsCount: number) {
        if (selectedItemsCount === 0) {
            this.router.navigate(['item', itemId], { relativeTo: this.route });
        } else {
            this.pageStore.toggleItemSelection(itemId);
        }
    }

    onItemPress(itemId: string) {
        this.pageStore.toggleItemSelection(itemId);
    }

    unselectAll() {
        this.pageStore.unselectAll();
    }

    canMarkSelected(selectedItems: string[], items: ReadonlyArray<ListItem>) {
        return selectedItems.findIndex(itemId => items.findIndex(i => (i.id === itemId) && !i.marked) > -1) > -1;
    }

    deleteSelected(listId: string, selectedItems: string[], items: ReadonlyArray<ListItem>) {
        this.pageStore.deleteItems({listId, items: items.filter(i => selectedItems.indexOf(i.id) > -1)});
    }

    markSelected(listId: string, selectedItems: string[], items: ReadonlyArray<ListItem>) {
        this.pageStore.updateItems({ listId, items: items.filter(i => selectedItems.indexOf(i.id) > -1).map(i => i.patch({ marked: true })) });
    }

    markAll(listId: string, items: ReadonlyArray<ListItem>) {
        if (!items?.length)
            return false;
        this.pageStore.updateItems({ listId, items: items.map(i => i.patch({ marked: true })) });
        return true;
    }

    restoreAll(listId: string, items: ReadonlyArray<ListItem>) {
        if (!items?.length)
            return false;
        this.pageStore.updateItems({ listId, items: items.map(i => i.patch({ marked: false })) });
        return true;
    }

    removeAll(listId: string, items: ReadonlyArray<ListItem>) {
        if (!items?.length)
            return false;
        this.pageStore.deleteItems({listId, items: items.map(i => i.clone()) });
        return true;
    }

    createShareToken(list: List) {
        if (this.auth.currentUser.uid != list.ownerId)
            return false;
            
        this.pageStore.createShareToken({ listId: list.id, updateToken: list.updateToken });
        return true;
    }

    shareList(shareToken: string) {
        navigator?.clipboard?.writeText(shareToken);
        return true;
    }

    onViewTypeChange(list: List, viewType: string) {
        if (viewType === 'category')
            this.pageStore.updateCurrentShownCategory(list.categories?.[0]);
        this.pageStore.updateList({ listId: list.id, patchObject: { viewType } });

        return true;
    }

    onCurrentShowCategoryChange(currentShownCategory: string) {
        this.pageStore.updateCurrentShownCategory(currentShownCategory);
    }

    itemTrack(index: number, item: ListItem) {
        return item.id;
    }

    async shareBy(listName: string, shareToken: string, items: readonly ListItem[]) {
        let shareData = {
            title: `yeplist - ${listName}`,
            text: `codice di condivisione:YP${shareToken}\r\n${items.map(i => `${i.qty} x ${i.name}`).join(',\r\n')}`
        }

        await navigator.share(shareData);
        return true;
    }
}