import { Component, OnInit, Optional } from '@angular/core';
import { Auth, browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  redirect = ['/'];

  constructor(
    @Optional() private auth: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(this.redirect);
  }

  loginWithApple() {
    // TODO: Implement Apple provider authentication
  }

}
