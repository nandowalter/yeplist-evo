import { Injectable } from "@angular/core";
import { tapResponse } from "@ngrx/component-store";
import { Observable, of, switchMap, tap } from "rxjs";
import { List } from "src/app/_models/list";
import { MainDataService } from "src/app/_services/main-data.service";
import { BaseState, BaseStore } from "src/app/_store/base-store";

export interface ListsSectionState extends BaseState {
    lists: List[];
    selectedLists: string[];
}

@Injectable()
export class ListsSectionStore extends BaseStore<ListsSectionState> {
    constructor(
        private dataService: MainDataService
    ) {
      super({ lists: null, selectedLists: [], loading: false, error: null });
    }

    readonly getLists = this.effect(() => {
        return of(null).pipe(
            tap(() => this.updateStore({ loading: true, lists: null, error: null })),
            switchMap(() => this.dataService.data.pipe(
                tapResponse(
                    value => this.updateStore({ loading: false, lists: value }),
                    error => this.updateStore({ loading: false, error })
                )
            ))
        );
    });

    readonly deleteLists = this.effect((params$: Observable<string[]>) => {
        return params$.pipe(
            tap(params => this.updateStore({ loading: true, error: null })),
            switchMap(params => this.dataService.deleteLists(params).pipe(
                tapResponse(
                    () => {},
                    error => this.updateStore({ loading: false, error }),
                    () => this.updateStore({ loading: false, selectedLists: [] })
                )
            ))
        );
    });

    readonly unselectAll = this.updater((state: ListsSectionState) => ({
        ...state,
        ...{ selectedLists: [] }
    }));

    readonly toggleListSelection = this.updater((state: ListsSectionState, listId: string) => ({
        ...state,
        ...{ selectedLists: state.selectedLists.find(i => i === listId) ? [...state.selectedLists.filter(i => i != listId)] : [...state.selectedLists, listId] }
    }));
}