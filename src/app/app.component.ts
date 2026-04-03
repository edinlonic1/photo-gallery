import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component -- minimal shell that hosts the router outlet.
 * All layout (header, nav) lives in ShellComponent, loaded via routing.
 *
 * OnPush is critical in a zoneless app: Angular only re-renders when
 * signal values change or inputs change. Without OnPush, components
 * would never be checked since there is no zone.js to trigger checks.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet />`,
})
export class AppComponent {}
