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
import { ReactiveFormsModule } from '@angular/forms';
import { NoAuthenticationGuard } from './_services/no-authentication.guard';
import { AlertComponent } from './alert/alert.component';
import { IconComponent } from './icon/icon.component';
import { IconDirective } from './icon/icon.directive';
import { AppScrollDirective } from './common/app-scroll.directive';
import { SearchPageComponent } from './search-page/search-page.component';
import { ListEntryComponent } from './common/list-entry/list-entry.component';
import { ListEditPageComponent } from './list-edit-page/list-edit-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [ AuthenticationGuard ],
    children: [
      { path: '', component: HomeSectionComponent, canActivate: [ AuthenticationGuard ] },
      { path: 'lists', component: ListsSectionComponent, canActivate: [ AuthenticationGuard ]},
      {
        path: 'list',
        canActivate: [ AuthenticationGuard ],
        outlet: 'secondaryPage',
        component: ListCreatePageComponent
      },
      {
        path: 'list/edit/:listId',
        canActivate: [ AuthenticationGuard ],
        outlet: 'secondaryPage',
        component: ListEditPageComponent
      },
      {
        path: 'search',
        component: SearchPageComponent,
        outlet: 'secondaryPage',
        canActivate: [ AuthenticationGuard ]
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
    SearchPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      enableTracing: false
    }),
    ReactiveFormsModule
  ],
  exports: [
    AppComponent,
    AuthButtonComponent
  ]
})
export class AppModule { }
