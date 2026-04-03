import { TestBed } from '@angular/core/testing';
import { FavoritesStore } from './favorites.store';
import { Photo } from '../models/photo.model';
import { provideZonelessChangeDetection } from '@angular/core';

const mockPhoto = (id: string): Photo => ({
  id,
  url: `https://picsum.photos/seed/${id}/400/300`,
  thumbnailUrl: `https://picsum.photos/seed/${id}/400/300`,
  author: 'Test Author',
  width: 400,
  height: 300,
});

describe('FavoritesStore', () => {
  let store: FavoritesStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    store = TestBed.inject(FavoritesStore);
  });

  afterEach(() => localStorage.clear());

  it('should start with empty favorites', () => {
    expect(store.favorites().length).toBe(0);
    expect(store.count()).toBe(0);
  });

  it('should add a favorite', () => {
    store.addFavorite(mockPhoto('1'));
    expect(store.favorites().length).toBe(1);
    expect(store.isFavorite('1')).toBeTrue();
  });

  it('should not add duplicate favorites', () => {
    store.addFavorite(mockPhoto('1'));
    store.addFavorite(mockPhoto('1'));
    expect(store.favorites().length).toBe(1);
  });

  it('should remove a favorite', () => {
    store.addFavorite(mockPhoto('1'));
    store.removeFavorite('1');
    expect(store.favorites().length).toBe(0);
    expect(store.isFavorite('1')).toBeFalse();
  });

  it('should toggle favorites correctly', () => {
    const photo = mockPhoto('1');
    store.toggleFavorite(photo);
    expect(store.isFavorite('1')).toBeTrue();
    store.toggleFavorite(photo);
    expect(store.isFavorite('1')).toBeFalse();
  });

  /**
   * In zoneless mode, effect() runs asynchronously after signal changes.
   * TestBed.flushEffects() forces all pending effects to execute synchronously,
   * so we can verify the localStorage write happened.
   */
  it('should persist to localStorage', () => {
    store.addFavorite(mockPhoto('1'));
    TestBed.flushEffects();
    const saved = JSON.parse(localStorage.getItem('photo_library_favorites') || '[]');
    expect(saved.length).toBe(1);
  });

  it('should load from localStorage on init', () => {
    localStorage.setItem(
      'photo_library_favorites',
      JSON.stringify([mockPhoto('42')])
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    const freshStore = TestBed.inject(FavoritesStore);
    expect(freshStore.isFavorite('42')).toBeTrue();
  });

  it('should find photo by id', () => {
    store.addFavorite(mockPhoto('5'));
    expect(store.getById('5')).toBeDefined();
    expect(store.getById('999')).toBeUndefined();
  });
});
