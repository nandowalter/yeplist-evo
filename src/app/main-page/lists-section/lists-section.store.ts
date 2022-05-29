import { Injectable, Optional } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { tapResponse } from "@ngrx/component-store";
import { concat, defaultIfEmpty, merge, Observable, of, switchMap, take, tap } from "rxjs";
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
        private dataService: MainDataService,
        @Optional() private auth: Auth
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
            switchMap(listIds => this.dataService.data.pipe(
                take(1),
                switchMap(lists => {
                    let idsToDelete = listIds.filter(li => lists.findIndex(l => l.id === li && l.ownerId === this.auth.currentUser?.uid) > -1);
                    let objsToUpdate = listIds.map(li => lists.find(l => l.id === li).clone()).filter(l => l.ownerId != this.auth.currentUser?.uid).map(l => ({ listId: l.id, list: { userIds: l.userIds.filter(ui => ui != this.auth.currentUser?.uid) } as Partial<List> }));
                    return this.dataService.multiBatch(objsToUpdate, idsToDelete).pipe(
                        tapResponse(
                            () => {},
                            error => this.updateStore({ loading: false, error }),
                            () => this.updateStore({ loading: false, selectedLists: [] })
                        )
                    );
                })
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