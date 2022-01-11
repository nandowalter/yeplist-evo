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
import { ListEditPageComponent } from './list-edit-page/list-edit-page.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [ AuthenticationGuard ],
    children: [
      { path: '', component: HomeSectionComponent },
      { path: 'lists', component: ListsSectionComponent }
    ]
  },
  {
    path: 'lists/edit',
    canActivate: [ AuthenticationGuard ],
    component: ListEditPageComponent
  },
  {
    path: 'login',
    canActivate: [ AuthenticationGuard ],
    component: LoginPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    MainPageComponent,
    ListEditPageComponent,
    LoginPageComponent,
    HomeSectionComponent,
    ListsSectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking'
    }),
    ReactiveFormsModule
  ],
  exports: [
    AppComponent,
    AuthButtonComponent
  ]
})
export class AppModule { }
