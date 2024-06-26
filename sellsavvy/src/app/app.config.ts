import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  ConfigService,
  configInitializerFactory,
} from './services/config.service';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authenticationInterceptor } from './interceptors/authentication.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configInitializerFactory,
      deps: [ConfigService],
      multi: true,
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([authenticationInterceptor])
    ),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
