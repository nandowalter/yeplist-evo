import { BehaviorSubject, combineLatest, map, Observable } from "rxjs";
import { IGenericStatePage } from "./generic-state-page.interface";

export class GenericPageStateObservables<T> {
    private _loading$?: BehaviorSubject<boolean>;
    private _data$?: Observable<T | null>;
    private _state$: Observable<IGenericStatePage<T>>;

    constructor(loadingObservable: BehaviorSubject<boolean>, dataObservable: Observable<T | null>) {
        this._loading$ = loadingObservable;
        this._data$ = dataObservable;
        this._state$ = combineLatest([
            this._loading$,
            this._data$
        ]).pipe(
            map(values => ({ loading: values[0], data: values[1] }))
        );
    }

    get loading$() {
        return this._loading$;
    }

    get data$() {
        return this._data$;
    }

    get state$() {
        return this._state$;
    }
}