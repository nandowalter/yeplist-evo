import { APP_ID, NgModule } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { browserPopupRedirectResolver, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { provideFirestore, initializeFirestore, persistentLocalCache } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { GestureConfig } from './gesture-config';
import { ServiceWorkerModule } from '@angular/service-worker';



@NgModule({
    imports: [
      BrowserAnimationsModule,
      HammerModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideFirestore(() => initializeFirestore(getApp(), {
        localCache: persistentLocalCache({})
      })),
      provideAuth(() => initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver
      })),
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
      { provide: APP_ID,  useValue: 'serverApp' },
      {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: GestureConfig,
      },
    ]
})
export class AppBrowserModule {

    constructor() { }
}
