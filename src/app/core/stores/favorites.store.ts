import { Injectable, signal, computed, effect } from '@angular/core';
import { Photo } from '../models/photo.model';

const FAVORITES_KEY = 'photo_library_favorites';

/**
 * Signal-based store for managing favorite photos.
 *
 * Uses an Angular effect() to reactively persist favorites to localStorage
 * whenever the signal value changes. The effect runs inside the injection
 * context (constructor), which is required for automatic cleanup.
 *
 * effect() creates a reactive side-effect that tracks signal reads inside it.
 * Whenever _favorites changes, the effect re-runs and saves to localStorage.
 * This is more elegant than manually calling save() after every mutation.
 *
 * In a zoneless app, signal mutations here automatically notify any component
 * that reads favorites() or count(), triggering their OnPush re-render.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly _favorites = signal<Photo[]>(this.loadFromStorage());

  /** Readonly signal of all favorite photos */
  readonly favorites = this._favorites.asReadonly();

  /** Computed signal: number of favorites (derived from _favorites) */
  readonly count = computed(() => this._favorites().length);

  constructor() {
    // Reactive persistence: saves to localStorage on every change
    effect(() => {
      this.saveToStorage(this._favorites());
    });
  }

  addFavorite(photo: Photo): void {
    if (this.isFavorite(photo.id)) return; // prevent duplicates
    this._favorites.update((favs) => [...favs, photo]);
  }

  removeFavorite(photoId: string): void {
    this._favorites.update((favs) => favs.filter((p) => p.id !== photoId));
  }

  isFavorite(photoId: string): boolean {
    return this._favorites().some((p) => p.id === photoId);
  }

  /** Toggle: add if not favorited, remove if already favorited */
  toggleFavorite(photo: Photo): void {
    if (this.isFavorite(photo.id)) {
      this.removeFavorite(photo.id);
    } else {
      this.addFavorite(photo);
    }
  }

  getById(id: string): Photo | undefined {
    return this._favorites().find((p) => p.id === id);
  }

  private loadFromStorage(): Photo[] {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      throw new Error('Failed to load favorites from localStorage');
    }
  }

  private saveToStorage(photos: Photo[]): void {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(photos));
    } catch {
      throw new Error('Failed to save favorites to localStorage');
    }
  }
}
