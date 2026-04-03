import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoCardComponent } from './photo-card.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { Photo } from '../../../core/models/photo.model';

const mockPhoto: Photo = {
  id: 'photo-1',
  url: 'https://picsum.photos/seed/1/400/300',
  thumbnailUrl: 'https://picsum.photos/seed/1/400/300',
  author: 'Test Author',
  width: 400,
  height: 300,
};

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
      providers: [
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photo', mockPhoto);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked when card is clicked', () => {
    const spy = jasmine.createSpy('clicked');
    component.clicked.subscribe(spy);
    fixture.nativeElement.querySelector('.photo-card').click();
    expect(spy).toHaveBeenCalledWith(mockPhoto);
  });

  it('should emit toggledFavorite when favorite button clicked', () => {
    const spy = jasmine.createSpy('toggledFavorite');
    component.toggledFavorite.subscribe(spy);
    fixture.nativeElement.querySelector('.favorite-btn').click();
    expect(spy).toHaveBeenCalledWith(mockPhoto);
  });

  it('should show filled heart icon when isFavorite is true', () => {
    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent.trim()).toBe('favorite');
  });

  it('should show border heart icon when isFavorite is false', () => {
    fixture.componentRef.setInput('isFavorite', false);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent.trim()).toBe('favorite_border');
  });
});
