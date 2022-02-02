import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { rotateInOutAnimation } from '../animations';
import { icon_collection, icon_heart, icon_home, icon_menu, icon_search, icon_trash, icon_x } from '../icon/icon-set';
import { NavbarMode } from '../_models/navbar-mode';
import { NavbarModeService } from '../_services/navbar-mode.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    rotateInOutAnimation
  ]
})
export class MainPageComponent {
  icons = {
    menu: icon_menu,
    search: icon_search,
    home: icon_home,
    collection: icon_collection,
    heart: icon_heart,
    x: icon_x,
    trash: icon_trash
  };
  state$: Observable<{ navbar: { mode: NavbarMode, label: string } }>;
  NavbarMode = NavbarMode;

  constructor(
    public router: Router,
    private navbarModeService: NavbarModeService
  ) { 
    this.state$ = navbarModeService.state.pipe(map(value => ({ navbar: value })));
  }

  onNavbarDelete() {
    
  }
}
