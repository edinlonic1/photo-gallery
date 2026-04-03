import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PhotoApiService } from './photo-api.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PhotoApiService', () => {
  let service: PhotoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(PhotoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate the correct number of photos', fakeAsync(() => {
    let result: any[] = [];
    service.generatePhotos(1, 10).subscribe((photos) => (result = photos));
    tick(400);
    expect(result.length).toBe(10);
  }));

  it('should generate unique ids across pages', fakeAsync(() => {
    let page1: any[] = [], page2: any[] = [];
    service.generatePhotos(1, 5).subscribe((photos) => (page1 = photos));
    service.generatePhotos(2, 5).subscribe((photos) => (page2 = photos));
    tick(400);
    const allIds = [...page1.map((p) => p.id), ...page2.map((p) => p.id)];
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(10);
  }));

  it('should produce valid picsum URLs', fakeAsync(() => {
    let result: any[] = [];
    service.generatePhotos(1, 1).subscribe((photos) => (result = photos));
    tick(400);
    expect(result[0].url).toContain('picsum.photos/seed/');
    expect(result[0].thumbnailUrl).toContain('picsum.photos/seed/');
  }));
});
