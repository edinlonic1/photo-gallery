import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavoritesStore } from '../../../../core/stores/favorites.store';
import { Photo } from '../../../../core/models/photo.model';
import { PhotosStore } from '../../../../core/stores/photos.store';

/**
 * Photo details page -- shows a full-size image with metadata.
 *
 * Accessible from both the gallery and the favorites page.
 * The favorite button adapts based on current state: shows "Add" or "Remove".
 * Back navigation uses browser history so it returns to whichever page
 * the user came from.
 */
@Component({
  selector: 'app-photo-details',
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-details.component.html',
  styleUrl: './photo-details.component.scss',
})
export class PhotoDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly photosStore = inject(PhotosStore);
  private readonly snackBar = inject(MatSnackBar);

  /** The photo being viewed -- set from route param on init */
  readonly photo = signal<Photo | undefined>(undefined);

  /** True until the full-size image has finished loading */
  readonly imageLoaded = signal(false);

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  /**
   * Computed signal: reactively checks if current photo is in favorites.
   * Updates automatically when favorites change.
   */
  readonly isFavorite = computed(() =>
    this.photo() ? this.favoritesStore.isFavorite(this.photo()!.id) : false
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Try favorites first, then gallery store
      const fromFavorites = this.favoritesStore.getById(id);
      if (fromFavorites) {
        this.photo.set(fromFavorites);
        return;
      }
      const fromStore = this.photosStore.photos().find((p) => p.id === id);
      if (fromStore) {
        this.photo.set(fromStore);
      }
    }
  }

  /** True while a download is in progress */
  readonly downloading = signal(false);

  toggleFavorite(): void {
    const p = this.photo();
    if (!p) return;

    if (this.isFavorite()) {
      this.favoritesStore.removeFavorite(p.id);
      this.snackBar.open('Removed from favorites', 'Dismiss', { duration: 3000 });
    } else {
      this.favoritesStore.addFavorite(p);
      this.snackBar.open('Added to favorites', 'Dismiss', { duration: 3000 });
    }
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Downloads the photo by fetching as a blob and triggering a save dialog.
   * Fetching as a blob avoids CORS issues with direct <a download> on cross-origin images.
   */
  async downloadPhoto(): Promise<void> {
    const p = this.photo();
    if (!p || this.downloading()) return;

    this.downloading.set(true);
    try {
      const response = await fetch(p.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${p.author.replace(/\s+/g, '-').toLowerCase()}-${p.id}.jpg`;
      anchor.click();
      URL.revokeObjectURL(url);
      this.snackBar.open('Download started', 'Dismiss', { duration: 2000 });
    } catch {
      this.snackBar.open('Download failed', 'Dismiss', { duration: 3000 });
    } finally {
      this.downloading.set(false);
    }
  }
}
