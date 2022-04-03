import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { listAnimations, listItemsAnimations, secondaryPageAnimations, showHideBottomAnimation } from 'src/app/animations';
import { ListEntryMode } from 'src/app/common/list-entry-mode';
import { ScrollDirection } from 'src/app/common/scroll-direction';
import { icon_check_circle, icon_chevron_right, icon_plus, icon_trash } from 'src/app/icon/icon-set';
import { List } from 'src/app/_models/list';
import { NavbarCommand } from 'src/app/_models/navbar-command';
import { NavbarMode } from 'src/app/_models/navbar-mode';
import { MainDataService } from 'src/app/_services/main-data.service';
import { NavbarModeService } from 'src/app/_services/navbar-mode.service';
import { ListsSectionState, ListsSectionStore } from './lists-section.store';

@Component({
    selector: 'app-lists-section',
    templateUrl: 'lists-section.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ListsSectionStore
    ],
    animations: [
        secondaryPageAnimations,
        listAnimations,
        listItemsAnimations,
        showHideBottomAnimation
    ]
})
export class ListsSectionComponent implements OnInit, OnDestroy {
    icons = {
        trash: icon_trash,
        plus: icon_plus,
        chevron_right: icon_chevron_right,
        check_circle: icon_check_circle
    };
    navbarCommand$$: Subscription;
    actualScrollDirection: ScrollDirection;
    ScrollDirection = ScrollDirection;
    ListEntryMode = ListEntryMode;
    state$: Observable<ListsSectionState>;
    
    constructor(
        private mainData: MainDataService,
        private navbarModeService: NavbarModeService,
        private router: Router,
        private route: ActivatedRoute,
        private store: ListsSectionStore,
        private cd: ChangeDetectorRef
    ) {
        
    }

    deleteLists(ids: string[]) {
        this.store.deleteLists(ids);
    }

    trackById(index: number, item: List) {
        return item.id;
    }

    processItemSelection(id: string) {
        this.store.toggleListSelection(id);
    }

    clearSelection() {
        this.store.unselectAll();
    }

    onItemTap(id: string, selectedListsCount: number) {
        if (selectedListsCount === 0) {
            this.router.navigate([{outlets: { 'secondaryPage': ['list', 'edit', id]}} ], { relativeTo: this.route.parent });
        } else {
            this.store.toggleListSelection(id);
        }
    }

    onNavbarCommandTriggerFactory(selectedLists?: string[]) {
        return (command: NavbarCommand) => {
            switch (command) {
                case NavbarCommand.Unselect:
                    this.clearSelection();
                    break;
                case NavbarCommand.Delete:
                    this.deleteLists(selectedLists);
                    break;
                default:
                    break;
            }
        }
    }

    goToAddList() {
        this.router.navigate([{outlets: { 'secondaryPage': ['list']}} ], { relativeTo: this.route.parent });
    }

    ngOnInit() {
        this.state$ = this.store.state$.pipe(
            tap(state => {
                if (this.navbarCommand$$) {
                    this.navbarCommand$$.unsubscribe();
                    this.navbarCommand$$ = null;
                }

                if (state.selectedLists.length === 0) {
                    this.navbarModeService.setLabel(null);
                    this.navbarModeService.setMode(NavbarMode.Normal);
                    this.actualScrollDirection = null;
                } else {   
                    this.navbarCommand$$ = this.navbarModeService.command.subscribe(this.onNavbarCommandTriggerFactory(state.selectedLists));
                    this.navbarModeService.setLabel(`${state.selectedLists.length}`);
                    this.navbarModeService.setMode(NavbarMode.Selection);
                }
            })
        );
    }

    ngOnDestroy(): void {
        if (this.navbarCommand$$)
            this.navbarCommand$$.unsubscribe();
    }
}