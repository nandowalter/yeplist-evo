import { NgModule } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { browserPopupRedirectResolver, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';


@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => {
          const firestore = getFirestore();
          enableMultiTabIndexedDbPersistence(firestore);
          return firestore;
        }),
        provideAuth(() => {
            const auth = initializeAuth(getApp(), {
              persistence: indexedDBLocalPersistence,
              popupRedirectResolver: browserPopupRedirectResolver,
            });
            return auth;
          }),
        AppModule
    ],
    declarations: [],
    bootstrap: [AppComponent]
})
export class AppBrowserModule {

    constructor() { }
}
