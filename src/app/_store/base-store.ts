import { state } from "@angular/animations";
import { ComponentStore } from "@ngrx/component-store";

export interface BaseState {
  loading: boolean;
  error: any;
}

export class BaseStore<T extends object> extends ComponentStore<T> {
  private initialState;

  constructor(initObj: T) {
    super(initObj);
    this.initialState = initObj;
  }

  readonly updateStore = this.updater((state, value: Partial<T>) => ({
      ...state,
      ...value
  }));

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    ...{ loading }
  }));

  readonly setError = this.updater((state, error: any) => ({
    ...state,
    ...{ error }
  }));

  readonly clearState = this.updater(state => this.initialState);
}