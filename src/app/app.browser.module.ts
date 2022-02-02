import { NgModule } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { browserPopupRedirectResolver, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { GestureConfig } from './gesture-config';



@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        HammerModule,
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
    bootstrap: [AppComponent],
    providers: [
      {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: GestureConfig,
      },
    ]
})
export class AppBrowserModule {

    constructor() { }
}
