import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesStore } from '../../../../core/stores/favorites.store';
import { PhotoCardComponent } from '../../../../shared/ui/photo-card/photo-card.component';
import { Photo } from '../../../../core/models/photo.model';

/**
 * Favorites page -- displays all saved photos from FavoritesStore.
 *
 * This is a "smart" (container) component: it reads from the store and
 * delegates rendering to the "dumb" PhotoCardComponent.
 *
 * Clicking a photo navigates to the detail page.
 * Toggling the favorite heart removes it from favorites (optimistic UI).
 */
@Component({
  selector: 'app-favorites-page',
  imports: [PhotoCardComponent, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss',
})
export class FavoritesPageComponent {
  readonly favoritesStore = inject(FavoritesStore);
  private readonly router = inject(Router);

  onPhotoClicked(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }

  onFavoriteToggled(photo: Photo): void {
    this.favoritesStore.removeFavorite(photo.id);
  }

  goToGallery(): void {
    this.router.navigate(['/']);
  }
}
