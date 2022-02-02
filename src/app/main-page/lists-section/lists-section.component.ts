import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { combineLatestWith, map, mergeWith, switchMap, take, tap } from 'rxjs/operators';
import { listAnimations, listItemsAnimations, secondaryPageAnimations } from 'src/app/animations';
import { icon_plus, icon_trash } from 'src/app/icon/icon-set';
import { List } from 'src/app/_models/list';
import { NavbarCommand } from 'src/app/_models/navbar-command';
import { NavbarMode } from 'src/app/_models/navbar-mode';
import { MainDataService } from 'src/app/_services/main-data.service';
import { NavbarModeService } from 'src/app/_services/navbar-mode.service';

@Component({
    selector: 'app-lists-section',
    templateUrl: 'lists-section.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        secondaryPageAnimations,
        listAnimations,
        listItemsAnimations
    ]
})
export class ListsSectionComponent {
    icons = {
        trash: icon_trash,
        plus: icon_plus
    };
    loading$ = new BehaviorSubject<boolean>(false);
    data$: Observable<List[] | null>;
    state$: Observable<{ loading: boolean, data: List[] | null }>;
    selectedItems: number[] = [];
    navbarCommand$$: Subscription;
    
    constructor(
        private mainData: MainDataService,
        private navbarModeService: NavbarModeService
    ) {
        this.initState();
    }

    initState() {
        this.data$ = of(null).pipe(
            tap(value => this.loading$.next(true)),
            mergeWith(this.mainData.data),
            tap(value => value ? this.loading$.next(false) : null)
        );
        this.state$ = this.loading$.pipe(
            combineLatestWith(this.data$),
            map(value => ({ loading: value[0], data: value[1] }))
        );
    }

    deleteList(id?: string) {
        if (!id)
            return;

        of(id).pipe(
            tap(value => this.loading$.next(true)),
            switchMap(value => this.mainData.deleteList(id as string)),
            tap(value => this.loading$.next(false)),
            take(1)
        ).subscribe();
    }

    trackById(index: number, item: List) {
        return item.id;
    }

    processItemSelection(index: number) {
        let selectedItemsIndex = this.selectedItems.indexOf(index);

        if (selectedItemsIndex === -1) {
            this.selectedItems.push(index);
        } else {
            this.selectedItems.splice(selectedItemsIndex, 1);
        }

        if (this.selectedItems.length === 0) {
            this.navbarCommand$$ = this.navbarModeService.command.subscribe(value => this.onNavbarCommand(value));
        } else {

        }

        this.navbarModeService.setLabel((this.selectedItems.length === 0) ? null : `${this.selectedItems.length}`);
        this.navbarModeService.setMode((this.selectedItems.length === 0) ? NavbarMode.Normal : NavbarMode.Selection);
    }

    onItemTap(index: number) {
        if (this.selectedItems.length > 0) {
            this.processItemSelection(index);
        } else {

        }
    }

    onNavbarCommand(command: NavbarCommand) {
        switch (command) {
            case NavbarCommand.Unselect:
                
                break;
        
            default:
                break;
        }
    }
}