import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  redirect = ['/'];

  constructor(
    @Optional() private auth: Auth,
    private router: Router
  ) { }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(this.redirect);
  }

  loginWithApple() {
    // TODO: Implement Apple provider authentication
  }

}
