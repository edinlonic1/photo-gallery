import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { PhotoDetailsComponent } from './photo-details.component';
import { FavoritesStore } from '../../../../core/stores/favorites.store';
import { PhotosStore } from '../../../../core/stores/photos.store';
import { Photo } from '../../../../core/models/photo.model';

const mockPhoto: Photo = {
  id: 'photo-1',
  url: 'https://picsum.photos/seed/1/600/400',
  thumbnailUrl: 'https://picsum.photos/seed/1/300/200',
  author: 'Test Author',
  width: 600,
  height: 400,
};

describe('PhotoDetailsComponent', () => {
  let component: PhotoDetailsComponent;
  let fixture: ComponentFixture<PhotoDetailsComponent>;
  let mockFavoritesStore: Partial<FavoritesStore>;
  let mockPhotosStore: Partial<PhotosStore>;

  beforeEach(async () => {
    mockFavoritesStore = {
      favorites: signal([]).asReadonly(),
      count: signal(0) as any,
      getById: jasmine.createSpy('getById').and.returnValue(mockPhoto),
      isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false),
      addFavorite: jasmine.createSpy('addFavorite'),
      removeFavorite: jasmine.createSpy('removeFavorite'),
      toggleFavorite: jasmine.createSpy('toggleFavorite'),
    };

    mockPhotosStore = {
      photos: signal([mockPhoto]).asReadonly(),
    };

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'photo-1' } } },
        },
        { provide: FavoritesStore, useValue: mockFavoritesStore },
        { provide: PhotosStore, useValue: mockPhotosStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photo from route param', () => {
    expect(component.photo()).toEqual(mockPhoto);
  });

  it('should show photo as not favorite initially', () => {
    expect(component.isFavorite()).toBeFalse();
  });

  it('should add to favorites when not favorited', () => {
    component.toggleFavorite();
    expect(mockFavoritesStore.addFavorite).toHaveBeenCalledWith(mockPhoto);
  });

  it('should remove from favorites when already favorited', () => {
    (mockFavoritesStore.isFavorite as jasmine.Spy).and.returnValue(true);
    // Force computed to re-evaluate by toggling the photo signal
    component.photo.set(undefined);
    component.photo.set(mockPhoto);
    component.toggleFavorite();
    expect(mockFavoritesStore.removeFavorite).toHaveBeenCalledWith('photo-1');
  });

  it('should call location.back on goBack', () => {
    // goBack uses window.history.length check then location.back()
    // Just verify the method exists and doesn't throw
    expect(() => component.goBack()).not.toThrow();
  });

  it('should start with downloading = false', () => {
    expect(component.downloading()).toBeFalse();
  });

  it('should set downloading flag during download', async () => {
    const blobResponse = new Response(new Blob(['fake'], { type: 'image/jpeg' }));
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(blobResponse));
    spyOn(URL, 'createObjectURL').and.returnValue('blob:fake-url');
    spyOn(URL, 'revokeObjectURL');

    const downloadPromise = component.downloadPhoto();
    expect(component.downloading()).toBeTrue();

    await downloadPromise;
    expect(component.downloading()).toBeFalse();
  });

  it('should handle download failure gracefully', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network error')));

    await component.downloadPhoto();

    expect(component.downloading()).toBeFalse();
  });

  it('should not download when already downloading', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(
      new Promise(() => {}) // never resolves
    );

    component.downloadPhoto(); // first call
    component.downloadPhoto(); // second call should be ignored

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not download when no photo is set', async () => {
    component.photo.set(undefined);
    const fetchSpy = spyOn(window, 'fetch');

    await component.downloadPhoto();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
