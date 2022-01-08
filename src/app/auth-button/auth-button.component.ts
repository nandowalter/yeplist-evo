import { Component, Optional } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="authenticated; else loggedOut">
        <button (click)="signOut()">
            Log out
        </button>
    </ng-container>

    <ng-template #loggedOut>
        <button (click)="signIn()">Log in</button>
    </ng-template>`
})
export class AuthButtonComponent {
    user: any = null;

    constructor(
        @Optional() public auth: Auth
    ) { }
    
    signIn() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(this.auth, provider)
            .then((credential) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const token = credential.user?.toJSON();
                // The signed-in user info.
                this.user = credential.user;
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    signOut() {
        this.auth.signOut();
    }

    get authenticated(): boolean {
        return this.auth?.currentUser != null;
    }
}