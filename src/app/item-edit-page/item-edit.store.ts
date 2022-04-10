import { Injectable } from "@angular/core";
import { tapResponse } from "@ngrx/component-store";
import { catchError, combineLatest, map, Observable, of, switchMap, tap, throwError } from "rxjs";
import { KnownItem } from "../_models/known-item";
import { ListItem } from "../_models/list-item";
import { MainDataService } from "../_services/main-data.service";
import { BaseState, BaseStore } from "../_store/base-store";

export interface ItemEditState extends BaseState {
    listId: string;
    item: ListItem;
    saved: boolean;
    nameSuggestions: { existing?: ListItem[], known?: KnownItem[] }
}
  
@Injectable()
export class ItemEditStore extends BaseStore<ItemEditState> {
    constructor(
        private dataService: MainDataService
    ) {
      super({ listId: null, item: null, saved: false, loading: false, error: null, nameSuggestions: null });
    }

    readonly getItem = this.effect((params$: Observable<{ listId: string, itemId: string }>) => {
        return params$.pipe(
            tap(value => this.updateStore({ loading: true, listId: value.listId, error: null, nameSuggestions: null })),
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
            tap(() => this.updateStore({ loading: true, error: null, nameSuggestions: null })),
            switchMap(value => this.dataService.findItemInListByName(value.listId, value.item.name).pipe(
                switchMap(itemsFound => itemsFound?.length > 0 ? throwError(() => ({ field: 'name', validationError: 'notUnique' })) : of(value))
            )),
            switchMap(value => (
                value.item.id ? 
                this.dataService.updateItem(value.listId, value.item) 
                : 
                this.dataService.addItem(value.listId, value.item)
            ).pipe(
                switchMap(() => this.dataService.addKnownItem(value.item.name, value.item.category, value.item.um).pipe(
                    tapResponse(
                        () => this.updateStore({ loading: false, saved: true }),
                        error => this.updateStore({ loading: false, error })
                    )
                ))
            )),
            catchError(error => {
                this.updateStore({ loading: false, error });
                return of(null);
            })
        );
    });

    readonly getNameSuggestions = this.effect((value$: Observable<{ listId: string, searchText: string, currentItemId: string }>) => {
        return value$.pipe(
            tap(() => this.updateStore({ error: null })),
            switchMap(value => combineLatest([
                this.dataService.findKnownItemByName(value.searchText),
                value.listId ? this.dataService.findItemInListByName(value.listId, value.searchText, false) : of(null),
                of({ currentItemId: value.currentItemId, searchText: value.searchText })
            ]).pipe(
                map(values => ({ knownItems: values[0], existingItems: values[1], params: values[2] })),
                tapResponse(
                    values => this.updateStore({ 
                        loading: false, 
                        nameSuggestions: { 
                            known: values.knownItems.filter(k => values.existingItems.every(e => e.name != k.name) && k.name != values.params.searchText), 
                            existing: values.existingItems.filter(e => e.id != values.params.currentItemId)
                        } 
                    }),
                    error => this.updateStore({ loading: false, error })
                )
            ))
        );
    });

    readonly updateSaved = this.updater((state, saved: boolean) => ({
        ...state,
        saved
    }));

    readonly clearSuggestions = this.updater((state) => ({
        ...state,
        nameSuggestions: null
    }));
}