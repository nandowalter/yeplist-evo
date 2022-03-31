import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { combineLatest, Observable, of, switchMap, tap } from "rxjs";
import { ListItem } from "../_models/list-item";
import { MainDataService } from "../_services/main-data.service";

export interface ItemEditState {
    listId: string;
    loading: boolean;
    item: ListItem;
    saved: boolean;
  }
  
  @Injectable()
  export class ItemEditStore extends ComponentStore<ItemEditState> {
    
    constructor(
        private dataService: MainDataService
    ) {
      super({ listId: null, loading: false, item: null, saved: false });
    }

    readonly getItem = this.effect((params$: Observable<{ listId: string, itemId: string }>) => {
        return params$.pipe(
            tap(() => this.updateLoading(true)),
            tap(value => this.updateListId(value.listId)),
            switchMap(value => value ? this.dataService.getItem(value.listId, value.itemId) : of(null)),
            tap(value => this.updateItem(value)),
            tap(() => this.updateLoading(false))
        );
        /*return movieId$.pipe(
          // 👇 Handle race condition with the proper choice of the flattening operator.
          switchMap((id) => this.moviesService.fetchMovie(id).pipe(
            //👇 Act on the result within inner pipe.
            tap({
              next: (movie) => this.addMovie(movie),
              error: (e) => this.logError(e),
            }),
            // 👇 Handle potential error within inner pipe.
            catchError(() => EMPTY),
          )),
        );*/
    });

    readonly saveItem = this.effect((params$: Observable<{ listId: string, item: ListItem }>) => {
        return params$.pipe(
            tap(() => this.updateLoading(true)),
            switchMap(value => value.item.id ? this.dataService.updateItem(value.listId, value.item) : this.dataService.addItem(value.listId, value.item)),
            tap(() => this.updateSaved(true)),
            tap(() => this.updateLoading(false)),
        )
    })

    readonly updateLoading = this.updater((state, loading: boolean) => ({
        ...state,
        loading
    }));

    readonly updateSaved = this.updater((state, saved: boolean) => ({
        ...state,
        saved
    }));

    readonly updateItem = this.updater((state, item: ListItem) => ({
        ...state,
        item
    }));

    readonly updateListId = this.updater((state, listId: string) => ({
        ...state,
        listId
    }))
  }