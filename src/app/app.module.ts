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
import { NoAuthenticationGuard } from './_services/no-authentication.guard';
import { AlertComponent } from './alert/alert.component';
import { IconComponent } from './icon/icon.component';
import { IconDirective } from './icon/icon.directive';
import { ScrollDetectDirective } from './common/scroll-detect.directive';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [ AuthenticationGuard ],
    children: [
      { path: '', component: HomeSectionComponent, canActivate: [ AuthenticationGuard ] },
      { path: 'lists', component: ListsSectionComponent, canActivate: [ AuthenticationGuard ], 
        children: [
          {
            path: 'edit',
            canActivate: [ AuthenticationGuard ],
            component: ListEditPageComponent,
            data: { animationState: 'One' }
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
    ListEditPageComponent,
    LoginPageComponent,
    HomeSectionComponent,
    ListsSectionComponent,
    IconComponent,
    IconDirective,
    ScrollDetectDirective
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
