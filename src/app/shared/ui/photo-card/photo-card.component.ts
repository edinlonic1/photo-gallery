import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Photo } from '../../../core/models/photo.model';

/**
 * Presentational (dumb) component for displaying a single photo card.
 *
 * Uses Angular signal-based input()/output() APIs (stable in Angular 17+).
 * These replace the older @Input/@Output decorators and integrate with
 * Angular's signal-based change detection system.
 *
 * - input.required<Photo>(): Declares a required signal input. The parent
 *   must provide [photo]. Accessing photo() returns the current value.
 *
 * - output<Photo>(): Creates an OutputEmitterRef that emits events to the parent.
 *   Equivalent to EventEmitter but designed for the new signal architecture.
 *
 * OnPush + signals = the component only re-renders when its inputs change,
 * which is essential in zoneless mode (no zone.js to trigger global CD).
 */
@Component({
  selector: 'app-photo-card',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  photo = input.required<Photo>();
  isFavorite = input<boolean>(false);

  /** Emitted when the card body is clicked */
  clicked = output<Photo>();

  /** Emitted when the favorite heart button is toggled */
  toggledFavorite = output<Photo>();

  onCardClick(): void {
    this.clicked.emit(this.photo());
  }

  /** stopPropagation prevents the card click handler from also firing */
  onFavoriteToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggledFavorite.emit(this.photo());
  }
}
