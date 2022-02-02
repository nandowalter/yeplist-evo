import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavbarCommand } from '../_models/navbar-command';
import { NavbarMode } from '../_models/navbar-mode';

@Injectable({providedIn: 'root'})
export class NavbarModeService {
    private mode$ = new BehaviorSubject<NavbarMode>(NavbarMode.Normal);
    private label$ = new BehaviorSubject<string>(null);
    private state$: Observable<{ mode: NavbarMode, label: string }>;
    private command$ = new Subject<NavbarCommand>();

    constructor() {
        this.state$ = combineLatest([
            this.mode$,
            this.label$,
        ]).pipe(
            map(value => ({ mode: value[0], label: value[1] }))
        );
    }
    
    get state(): Observable<{ mode: NavbarMode, label: string }> {
        return this.state$;
    }

    get command(): Observable<NavbarCommand> {
        return this.command$;
    }

    setMode(mode: NavbarMode) {
        this.mode$.next(mode);
    }

    setLabel(label: string) {
        this.label$.next(label);
    }

    triggerCommand(command: NavbarCommand) {
        this.command$.next(command);
    }
}