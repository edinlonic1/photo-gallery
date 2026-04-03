import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PhotosStore } from './photos.store';
import { PhotoApiService } from '../services/photo-api.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Photo } from '../models/photo.model';
import { provideZonelessChangeDetection } from '@angular/core';

const mockPhotos = (count: number, start = 1): Photo[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `photo-${start + i}`,
    url: `https://picsum.photos/seed/${start + i}/400/300`,
    thumbnailUrl: `https://picsum.photos/seed/${start + i}/400/300`,
    author: 'Test Author',
    width: 400,
    height: 300,
  }));

describe('PhotosStore', () => {
  let store: PhotosStore;
  let photoApiSpy: jasmine.SpyObj<PhotoApiService>;

  beforeEach(() => {
    photoApiSpy = jasmine.createSpyObj('PhotoApiService', ['generatePhotos']);
    photoApiSpy.generatePhotos.and.returnValue(of(mockPhotos(20)).pipe(delay(250)));

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        PhotosStore,
        { provide: PhotoApiService, useValue: photoApiSpy },
      ],
    });
    store = TestBed.inject(PhotosStore);
  });

  it('should start with empty photos', () => {
    expect(store.photos().length).toBe(0);
    expect(store.loading()).toBeFalse();
  });

  it('should set loading=true while fetching', fakeAsync(() => {
    store.loadMore();
    expect(store.loading()).toBeTrue();
    tick(300);
    expect(store.loading()).toBeFalse();
  }));

  it('should append photos on loadMore', fakeAsync(() => {
    store.loadMore();
    tick(300);
    expect(store.photos().length).toBe(20);

    photoApiSpy.generatePhotos.and.returnValue(of(mockPhotos(20, 21)).pipe(delay(250)));
    store.loadMore();
    tick(300);
    expect(store.photos().length).toBe(40);
  }));

  it('should not load more while loading is true', fakeAsync(() => {
    store.loadMore();
    store.loadMore();
    tick(300);
    expect(photoApiSpy.generatePhotos).toHaveBeenCalledTimes(1);
  }));

  it('should reset correctly', fakeAsync(() => {
    store.loadMore();
    tick(300);
    store.reset();
    expect(store.photos().length).toBe(0);
    expect(store.loading()).toBeFalse();
  }));
});
