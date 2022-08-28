import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthenticationGuard } from './_services/authentication.guard';
import { HomeSectionComponent } from './main-page/home-section/home-section.component';
import { ListsSectionComponent } from './main-page/lists-section/lists-section.component';
import { ListCreatePageComponent } from './list-create-page/list-create-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoAuthenticationGuard } from './_services/no-authentication.guard';
import { AlertComponent } from './alert/alert.component';
import { IconComponent } from './icon/icon.component';
import { IconDirective } from './icon/icon.directive';
import { AppScrollDirective } from './common/app-scroll.directive';
import { SearchSectionComponent } from './main-page/search-section/search-section.component';
import { ListEntryComponent } from './common/list-entry/list-entry.component';
import { ListEditPageComponent } from './list-edit-page/list-edit-page.component';
import { ItemEditPageComponent } from './item-edit-page/item-edit-page.component';
import { ItemElementComponent } from './common/item-element/item-element.component';
import { PanManagerComponent } from './common/pan-manager/pan-manager.component';
import { ModalDialogComponent } from './common/modal-dialog/modal-dialog.component';
import { DropdownMenuComponent } from './common/dropdown-menu/dropdown-menu.component';
import { QrCanvasComponent } from './qr-canvas/qr-canvas.components';
import { CamComponent } from './cam/cam.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [ AuthenticationGuard ],
    children: [
      { path: '', redirectTo: '/lists', pathMatch: 'full' /* component: HomeSectionComponent, canActivate: [ AuthenticationGuard ] */ },
      { path: 'lists', component: ListsSectionComponent, canActivate: [ AuthenticationGuard ] },
      { path: 'search', component: SearchSectionComponent, canActivate: [ AuthenticationGuard ] },
      {
        path: 'list',
        canActivate: [ AuthenticationGuard ],
        // outlet: 'secondaryPage',
        component: ListCreatePageComponent
      },
      {
        path: 'list/edit/:listId',
        canActivate: [ AuthenticationGuard ],
        //outlet: 'secondaryPage',
        component: ListEditPageComponent,
        children: [
          {
            path: 'item',
            canActivate: [ AuthenticationGuard ],
            component: ItemEditPageComponent
          },
          {
            path: 'item/:itemId',
            canActivate: [ AuthenticationGuard ],
            component: ItemEditPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    canActivate: [ NoAuthenticationGuard ],
    component: LoginPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    AlertComponent,
    MainPageComponent,
    ListCreatePageComponent,
    ListEditPageComponent,
    LoginPageComponent,
    HomeSectionComponent,
    ListsSectionComponent,
    ListEntryComponent,
    IconComponent,
    IconDirective,
    AppScrollDirective,
    SearchSectionComponent,
    ItemEditPageComponent,
    ItemElementComponent,
    PanManagerComponent,
    ModalDialogComponent,
    DropdownMenuComponent,
    QrCanvasComponent,
    CamComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      enableTracing: false
    }),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AppComponent,
    AuthButtonComponent
  ]
})
export class AppModule { }
