import { Injectable, Optional } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoAuthenticationGuard implements CanActivate {

  constructor(
    @Optional() private auth: Auth,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return authState(this.auth).pipe(
      map(value => {
        if (!value) {
          return true;
        } else {
          this.router.navigate([''])
          return false;
        }
      })
    );
  }
}
