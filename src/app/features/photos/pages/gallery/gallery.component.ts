import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  viewChild,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { PhotosStore } from '../../../../core/stores/photos.store';
import { FavoritesStore } from '../../../../core/stores/favorites.store';
import { PhotoCardComponent } from '../../../../shared/ui/photo-card/photo-card.component';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';
import { Photo } from '../../../../core/models/photo.model';

/**
 * Photos gallery page with infinite scrolling.
 *
 * Infinite scroll strategy:
 * We use IntersectionObserver instead of scroll event listeners. A hidden
 * "sentinel" div is placed at the bottom of the photo grid. When this
 * sentinel enters the viewport (or comes within 200px of it, via rootMargin),
 * the observer callback fires and triggers loadMore().
 *
 * Why IntersectionObserver > scroll events:
 * 1. No debouncing/throttling needed -- the browser handles it natively
 * 2. Better performance -- no JS runs on every scroll pixel
 * 3. rootMargin lets us pre-fetch before the user reaches the bottom
 * 4. Automatic cleanup via disconnect()
 *
 * The _loading guard in PhotosStore prevents duplicate API calls even if
 * the observer fires multiple times rapidly.
 *
 * In zoneless mode, the store's signal mutations (photos, loading) automatically
 * notify this OnPush component to re-render -- no zone.js needed.
 */
@Component({
  selector: 'app-gallery',
  imports: [PhotoCardComponent, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * viewChild() is the signal-based equivalent of @ViewChild.
   * Returns a signal that resolves after the view is initialized.
   * Required flag means Angular will throw if the element is missing.
   */
  private readonly sentinelRef = viewChild.required<ElementRef<HTMLDivElement>>('sentinel');

  private readonly router = inject(Router);
  readonly photosStore = inject(PhotosStore);
  private readonly favoritesStore = inject(FavoritesStore);

  private observer?: IntersectionObserver;

  /** Checks favorite status per photo ID -- called from the template */
  readonly isFavorite = (photoId: string) =>
    this.favoritesStore.isFavorite(photoId);

  ngOnInit(): void {
    // Load initial batch only if the store is empty (preserves state on back-navigation)
    if (this.photosStore.photos().length === 0) {
      this.photosStore.loadMore();
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Clean up observer to prevent memory leaks
    this.observer?.disconnect();
  }

  onPhotoClicked(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }

  onFavoriteToggled(photo: Photo): void {
    this.favoritesStore.toggleFavorite(photo);
  }

  /**
   * Sets up IntersectionObserver on the sentinel element.
   * rootMargin: '200px' means we start loading 200px BEFORE the sentinel
   * is actually visible, giving the API time to respond before the user
   * reaches the bottom (smoother infinite scroll experience).
   */
  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.photosStore.loading() && this.photosStore.hasMore()) {
          this.photosStore.loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    this.observer.observe(this.sentinelRef().nativeElement);
  }
}
