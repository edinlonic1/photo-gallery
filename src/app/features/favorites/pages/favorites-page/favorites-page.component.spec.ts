import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPageComponent } from './favorites-page.component';
import { FavoritesStore } from '../../../../core/stores/favorites.store';
import { Router, provideRouter } from '@angular/router';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { Photo } from '../../../../core/models/photo.model';

const mockFavorites: Photo[] = [
  { id: '1', url: 'u1', thumbnailUrl: 'u1', author: 'A', width: 400, height: 300 },
];

describe('FavoritesPageComponent', () => {
  let component: FavoritesPageComponent;
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let mockFavoritesStore: Partial<FavoritesStore>;

  beforeEach(async () => {
    mockFavoritesStore = {
      favorites: signal(mockFavorites).asReadonly(),
      count: signal(1) as any,
      isFavorite: jasmine.createSpy().and.returnValue(true),
      removeFavorite: jasmine.createSpy(),
      addFavorite: jasmine.createSpy(),
      toggleFavorite: jasmine.createSpy(),
      getById: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: FavoritesStore, useValue: mockFavoritesStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render favorite photo cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-photo-card');
    expect(cards.length).toBe(1);
  });

  it('should remove from favorites on toggledFavorite', () => {
    component.onFavoriteToggled(mockFavorites[0]);
    expect(mockFavoritesStore.removeFavorite).toHaveBeenCalledWith('1');
  });

  it('should navigate to photo details on photo click', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.onPhotoClicked(mockFavorites[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/photos', '1']);
  });
});
