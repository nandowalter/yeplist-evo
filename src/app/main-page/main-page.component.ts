import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { icon_collection, icon_heart, icon_home, icon_menu, icon_search } from '../icon/icon-set';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit {
  icons = {
    menu: icon_menu,
    search: icon_search,
    home: icon_home,
    collection: icon_collection,
    heart: icon_heart
  };

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
  }

}
