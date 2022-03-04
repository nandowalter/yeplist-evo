import { BehaviorSubject, Observable } from "rxjs";

export interface IGenericStatePage<T> {
    loading?: boolean;
    data?: T | null;
}