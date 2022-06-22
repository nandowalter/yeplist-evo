import { NgModule } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { browserPopupRedirectResolver, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { GestureConfig } from './gesture-config';
import { ServiceWorkerModule } from '@angular/service-worker';



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
        provideStorage(() => getStorage()),
        AppModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
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
