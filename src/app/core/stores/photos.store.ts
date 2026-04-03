import { Injectable, signal, computed } from '@angular/core';
import { PhotoApiService } from '../services/photo-api.service';
import { Photo } from '../models/photo.model';
import { environment } from '../config/app.config';

/**
 * Signal-based store for the photos gallery.
 *
 * Encapsulates all gallery state using Angular Signals, exposing readonly
 * accessors so consumers can only read (never mutate) state directly.
 *
 * In a zoneless app, signals are the primary mechanism for change detection.
 * When a signal's value changes, Angular automatically marks dependent
 * components for re-render -- no zone.js needed.
 *
 * The _loading guard in loadMore() prevents duplicate API calls when the
 * IntersectionObserver fires multiple times before the first request resolves.
 */
@Injectable({ providedIn: 'root' })
export class PhotosStore {
  private readonly _photos = signal<Photo[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _currentPage = signal<number>(0);
  private readonly _hasMore = signal<boolean>(true);

  /** All loaded photos (append-only as user scrolls) */
  readonly photos = this._photos.asReadonly();

  /** True while an API request is in flight */
  readonly loading = this._loading.asReadonly();

  /** False when server returns fewer items than pageSize */
  readonly hasMore = this._hasMore.asReadonly();

  /** Computed: true when no photos loaded and not currently loading */
  readonly isEmpty = computed(() => this._photos().length === 0 && !this._loading());

  constructor(private readonly photoApi: PhotoApiService) {}

  /**
   * Fetches the next page of photos and appends to the existing list.
   * Guards against concurrent calls via the _loading flag.
   */
  loadMore(): void {
    if (this._loading() || !this._hasMore()) return;

    this._loading.set(true);
    const nextPage = this._currentPage() + 1;

    this.photoApi.generatePhotos(nextPage, environment.pageSize).subscribe({
      next: (photos) => {
        this._photos.update((existing) => [...existing, ...photos]);
        this._currentPage.set(nextPage);
        this._loading.set(false);
        if (photos.length < environment.pageSize) {
          this._hasMore.set(false);
        }
      },
      error: () => {
        this._loading.set(false);
      },
    });
  }

  /** Resets the store to its initial empty state */
  reset(): void {
    this._photos.set([]);
    this._loading.set(false);
    this._currentPage.set(0);
    this._hasMore.set(true);
  }
}
