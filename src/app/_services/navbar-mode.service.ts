import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, distinct, tap } from 'rxjs/operators';
import { NavbarCommand } from '../_models/navbar-command';
import { NavbarMode } from '../_models/navbar-mode';

@Injectable({providedIn: 'root'})
export class NavbarModeService {
    private mode$ = new BehaviorSubject<NavbarMode>(NavbarMode.Normal);
    private label$ = new BehaviorSubject<string>(null);
    private state$: Observable<{ mode: NavbarMode, label: string }>;
    private command$ = new Subject<{ command: NavbarCommand, value?: any }>();

    constructor() {
        this.state$ = combineLatest([
            this.mode$.pipe(),
            this.label$.pipe(),
        ]).pipe(
            map(value => ({ mode: value[0], label: value[1] }))
        );
    }
    
    get state(): Observable<{ mode: NavbarMode, label: string }> {
        return this.state$;
    }

    get command(): Observable<{ command: NavbarCommand, value?: any }> {
        return this.command$;
    }

    setMode(mode: NavbarMode) {
        this.mode$.next(mode);
    }

    setLabel(label: string) {
        this.label$.next(label);
    }

    triggerCommand(command: NavbarCommand, value?: any) {
        this.command$.next({ command, value });
    }
}