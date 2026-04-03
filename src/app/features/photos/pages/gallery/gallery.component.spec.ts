import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryComponent } from './gallery.component';
import { PhotosStore } from '../../../../core/stores/photos.store';
import { FavoritesStore } from '../../../../core/stores/favorites.store';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { Photo } from '../../../../core/models/photo.model';

const mockPhotos: Photo[] = [
  { id: '1', url: 'u1', thumbnailUrl: 'u1', author: 'A', width: 400, height: 300 },
  { id: '2', url: 'u2', thumbnailUrl: 'u2', author: 'B', width: 400, height: 300 },
];

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let mockPhotosStore: Partial<PhotosStore>;
  let mockFavoritesStore: Partial<FavoritesStore>;
  let router: Router;

  beforeEach(async () => {
    mockPhotosStore = {
      photos: signal(mockPhotos).asReadonly(),
      loading: signal(false).asReadonly(),
      hasMore: signal(true).asReadonly(),
      isEmpty: signal(false) as any,
      loadMore: jasmine.createSpy('loadMore'),
      reset: jasmine.createSpy('reset'),
    };

    mockFavoritesStore = {
      favorites: signal([]).asReadonly(),
      count: signal(0) as any,
      isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false),
      toggleFavorite: jasmine.createSpy('toggleFavorite'),
      addFavorite: jasmine.createSpy('addFavorite'),
      removeFavorite: jasmine.createSpy('removeFavorite'),
      getById: jasmine.createSpy('getById'),
    };

    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: PhotosStore, useValue: mockPhotosStore },
        { provide: FavoritesStore, useValue: mockFavoritesStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render photo cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-photo-card');
    expect(cards.length).toBe(2);
  });

  it('should navigate to photo details on card click', () => {
    component.onPhotoClicked(mockPhotos[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/photos', '1']);
  });

  it('should toggle favorite on favorite button click', () => {
    component.onFavoriteToggled(mockPhotos[0]);
    expect(mockFavoritesStore.toggleFavorite).toHaveBeenCalledWith(mockPhotos[0]);
  });
});
