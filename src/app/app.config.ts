import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Key architectural decisions:
 * - provideZonelessChangeDetection(): Removes zone.js entirely from the bundle.
 *   Angular relies on Signals and OnPush to detect changes instead of monkey-patching
 *   every async API (setTimeout, Promise, etc.). This reduces bundle size and improves
 *   performance since no global change detection cycles run after every async event.
 *
 * - withComponentInputBinding(): Enables automatic binding of route params to
 *   component inputs -- e.g. a route param ':id' auto-binds to an input named 'id'.
 *
 * - withFetch(): Uses the Fetch API backend for HttpClient instead of XMLHttpRequest.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
};
