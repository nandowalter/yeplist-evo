import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthenticationGuard } from './_services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [ AuthenticationGuard ]
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    MainPageComponent,
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [
    AppComponent,
    AuthButtonComponent
  ]
})
export class AppModule { }
