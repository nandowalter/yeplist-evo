import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { rotateInOutAnimation, secondaryPageAnimations } from '../animations';
import { icon_arrow_left, icon_collection, icon_heart, icon_home, icon_menu, icon_search, icon_trash, icon_x } from '../icon/icon-set';
import { NavbarCommand } from '../_models/navbar-command';
import { NavbarMode } from '../_models/navbar-mode';
import { NavbarModeService } from '../_services/navbar-mode.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: [ 'main-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    secondaryPageAnimations,
    rotateInOutAnimation
  ]
})
export class MainPageComponent implements OnInit, OnDestroy {
  icons = {
    menu: icon_menu,
    search: icon_search,
    home: icon_home,
    collection: icon_collection,
    heart: icon_heart,
    x: icon_x,
    trash: icon_trash,
    arrowLeft: icon_arrow_left
  };
  state$: Observable<{ navbar: { mode: NavbarMode, label: string } }>;
  NavbarMode = NavbarMode;
  NavbarCommand = NavbarCommand;
  searchDataGroup: UntypedFormGroup;
  searchText$$: Subscription;

  constructor(
    public router: Router,
    private navbarModeService: NavbarModeService
  ) { 
    this.state$ = navbarModeService.state.pipe(map(value => ({ navbar: value })));
  }

  ngOnInit(): void {
    this.initSearchForm();
  }

  ngOnDestroy(): void {
    if (this.searchText$$)
      this.searchText$$.unsubscribe();
  }

  onNavbarCommand(command: NavbarCommand) {
    this.navbarModeService.triggerCommand(command);
  }

  goToSearch() {
    this.navbarModeService.setMode(NavbarMode.Search);
    this.router.navigate(['/search'], { skipLocationChange: true });
  }

  deactivateSearchMode() {
    this.navbarModeService.setMode(NavbarMode.Normal);
  }

  private initSearchForm() {
    this.searchDataGroup = new UntypedFormGroup({
      searchText: new UntypedFormControl(null, [])
    });

    this.searchText$$ = this.searchDataGroup.get('searchText').valueChanges.pipe(debounceTime(500)).subscribe({
      next: text => this.navbarModeService.triggerCommand(NavbarCommand.SearchText, text)
    });
  }
}
