import { Injectable } from "@angular/core";
import { tapResponse } from "@ngrx/component-store";
import { Observable, of, switchMap, tap } from "rxjs";
import { ListItem } from "../_models/list-item";
import { MainDataService } from "../_services/main-data.service";
import { BaseState, BaseStore } from "../_store/base-store";

export interface ItemEditState extends BaseState {
    listId: string;
    item: ListItem;
    saved: boolean;
}
  
@Injectable()
export class ItemEditStore extends BaseStore<ItemEditState> {
    constructor(
        private dataService: MainDataService
    ) {
      super({ listId: null, item: null, saved: false, loading: false, error: null });
    }

    readonly getItem = this.effect((params$: Observable<{ listId: string, itemId: string }>) => {
        return params$.pipe(
            tap(value => this.updateStore({ loading: true, listId: value.listId, error: null })),
            switchMap(value => ((value?.listId && value?.itemId) ? this.dataService.getItem(value.listId, value.itemId) : of<ListItem>(null)).pipe(
                tapResponse(
                    value => this.updateStore({ loading: false, item: value }),
                    error => this.updateStore({ loading: false, error })
                )
            ))
        );
    });

    readonly saveItem = this.effect((params$: Observable<{ listId: string, item: ListItem }>) => {
        return params$.pipe(
            tap(() => this.updateStore({ loading: true, error: null })),
            switchMap(value => (value.item.id ? this.dataService.updateItem(value.listId, value.item) : this.dataService.addItem(value.listId, value.item)).pipe(
                tapResponse(
                    () => this.updateStore({ loading: false, saved: true }),
                    error => this.updateStore({ loading: false, error })
                )
            ))
        )
    });

    readonly updateSaved = this.updater((state, saved: boolean) => ({
        ...state,
        saved
    }));
}