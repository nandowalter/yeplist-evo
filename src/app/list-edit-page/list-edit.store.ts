import { Injectable } from "@angular/core";
import { tapResponse } from "@ngrx/component-store";
import { Observable, of, switchMap, tap } from "rxjs";
import { List } from "../_models/list";
import { ListItem } from "../_models/list-item";
import { MainDataService } from "../_services/main-data.service";
import { BaseState, BaseStore } from "../_store/base-store";

export interface ListEditState extends BaseState {
    listId: string;
    list: List;
    selectedItems: string[];
}

@Injectable()
export class ListEditStore extends BaseStore<ListEditState> {
    constructor(
        private dataService: MainDataService
    ) {
      super({ listId: null, loading: false, list: null, selectedItems: [], error: null });
    }

    readonly getList = this.effect((listId$: Observable<string>) => {
        return listId$.pipe(
            tap(listId => this.updateStore({ loading: true, listId: listId, error: null })),
            switchMap(listId => (listId ? this.dataService.getList(listId) : of<List>(null)).pipe(
                tapResponse(
                    value => this.updateStore({ loading: false, list: value }),
                    error => this.updateStore({ loading: false, error })
                )
            ))
        );
    });

    readonly updateItems = this.effect((params$: Observable<{ listId: string, items: ListItem[] }>) => {
        return params$.pipe(
            tap(params => this.updateStore({ loading: true, error: null })),
            switchMap(params => this.dataService.updateItems(params.listId, params.items).pipe(
                tapResponse(
                    value => this.updateStore({ loading: false, selectedItems: [] }),
                    error => this.updateStore({ loading: false, error })
                )
            ))
        );
    });

    readonly deleteItems = this.effect((params$: Observable<{ listId: string, items: ListItem[] }>) => {
        return params$.pipe(
            tap(params => this.updateStore({ loading: true, error: null })),
            switchMap(params => this.dataService.deleteItems(params.listId, params.items).pipe(
                tapResponse(
                    value => this.updateStore({ loading: false, selectedItems: [] }),
                    error => this.updateStore({ loading: false, error })
                )
            ))
        );
    });

    readonly unselectAll = this.updater((state: ListEditState) => ({
        ...state,
        ...{ selectedItems: [] }
    }));

    readonly toggleItemSelection = this.updater((state: ListEditState, itemId: string) => ({
        ...state,
        ...{ selectedItems: state.selectedItems.find(i => i === itemId) ? [...state.selectedItems.filter(i => i != itemId)] : [...state.selectedItems, itemId] }
    }));


}