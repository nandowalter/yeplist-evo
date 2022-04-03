import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { rotateInOutAnimation, showHideBottomAnimation } from '../animations';
import { ScrollDirection } from '../common/scroll-direction';
import { icon_arrow_left, icon_check, icon_clipboard_check, icon_plus, icon_reply, icon_trash, icon_x } from '../icon/icon-set';
import { ListItem } from '../_models/list-item';
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
export class ListEditPageComponent implements OnInit {
    state$: Observable<ListEditState>;
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
        private route: ActivatedRoute,
        private router: Router,
        private pageStore: ListEditStore
    ) {
        this.state$ = this.pageStore.state$;
    }

    ngOnInit(): void {
        this.pageStore.getList(
            this.route.paramMap.pipe(
                take(1),
                map(values => values.get('listId'))
            )
        );
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
}