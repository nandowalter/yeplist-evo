import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { combineLatestWith, map, mergeWith, switchMap, take, tap } from 'rxjs/operators';
import { listAnimations, listItemsAnimations, secondaryPageAnimations } from 'src/app/animations';
import { ScrollDirection } from 'src/app/common/scroll-direction';
import { icon_check_circle, icon_chevron_right, icon_plus, icon_trash } from 'src/app/icon/icon-set';
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
export class ListsSectionComponent implements OnDestroy {
    icons = {
        trash: icon_trash,
        plus: icon_plus,
        chevron_right: icon_chevron_right,
        check_circle: icon_check_circle
    };
    loading$ = new BehaviorSubject<boolean>(false);
    data$: Observable<List[] | null>;
    state$: Observable<{ loading: boolean, data: List[] | null }>;
    selectedItems: string[] = [];
    navbarCommand$$: Subscription;
    actualScrollDirection: ScrollDirection;
    ScrollDirection = ScrollDirection;
    
    constructor(
        private mainData: MainDataService,
        private navbarModeService: NavbarModeService,
        private cd: ChangeDetectorRef
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

    deleteSelectedItems() {
        this.deleteLists(this.selectedItems).subscribe({
            complete: () => this.clearSelection()
        });
    }

    deleteLists(ids: string[]) {
        if (!ids)
            return of(null);

        return of(ids).pipe(
            tap(value => this.loading$.next(true)),
            switchMap(value => this.mainData.deleteLists(ids)),
            tap(value => this.loading$.next(false)),
            take(1)
        );
    }

    trackById(index: number, item: List) {
        return item.id;
    }

    processItemSelection(index: number, id: string) {
        let selectedItemsIndex = this.selectedItems.indexOf(id);

        if (selectedItemsIndex === -1) {
            this.selectedItems.push(id);
        } else {
            this.selectedItems.splice(selectedItemsIndex, 1);
        }

        if (this.selectedItems.length === 0) {
            this.navbarCommand$$.unsubscribe();
            this.navbarCommand$$ = null;
        } else if (!this.navbarCommand$$) {
                this.navbarCommand$$ = this.navbarModeService.command.subscribe(value => this.onNavbarCommand(value));
        }

        this.navbarModeService.setLabel((this.selectedItems.length === 0) ? null : `${this.selectedItems.length}`);
        this.navbarModeService.setMode((this.selectedItems.length === 0) ? NavbarMode.Normal : NavbarMode.Selection);
    }

    clearSelection() {
        this.selectedItems = [];
        if (this.navbarCommand$$)
            this.navbarCommand$$.unsubscribe();

        this.navbarCommand$$ = null;
        this.navbarModeService.setLabel(null);
        this.navbarModeService.setMode(NavbarMode.Normal);
        this.cd.markForCheck();
    }

    onItemTap(index: number, id: string) {
        if (this.selectedItems.length > 0) {
            this.processItemSelection(index, id);
        } else {

        }
    }

    onNavbarCommand(command: NavbarCommand) {
        switch (command) {
            case NavbarCommand.Unselect:
                this.clearSelection();
                break;
            case NavbarCommand.Delete:
                this.deleteSelectedItems();
                break;
            default:
                break;
        }
    }

    ngOnDestroy(): void {
        if (this.navbarCommand$$)
            this.navbarCommand$$.unsubscribe();
    }
}