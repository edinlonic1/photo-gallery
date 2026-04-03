import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Photo } from '../models/photo.model';
import { environment } from '../config/app.config';

/**
 * Simulates a paginated photo API.
 *
 * Instead of hitting a real REST endpoint, we generate deterministic Photo objects
 * using a seed-based URL scheme from picsum.photos (https://picsum.photos/seed/{seed}/w/h).
 * Each page produces unique photo IDs based on (page * pageSize + index), ensuring
 * no duplicates across pages.
 *
 * A random delay between apiDelayMin..apiDelayMax ms is added via RxJS delay()
 * to simulate real network latency, which is important for testing loading states
 * and infinite scroll debouncing.
 */
@Injectable({ providedIn: 'root' })
export class PhotoApiService {
  private readonly AUTHORS = [
    'Alejandro Escamilla', 'Ilham Rahmansyah', 'Janko Ferlič',
    'Paul Jarvis', 'Bench Accounting', 'Redd Angelo',
    'Ales Krivec', 'Danielle MacInnes', 'Mikael Kristenson',
    'Matteo Vistocco',
  ];

  generatePhotos(page: number, pageSize: number = environment.pageSize): Observable<Photo[]> {
    // Random delay within configured bounds to simulate network latency
    const delayMs = Math.floor(Math.random() * (environment.apiDelayMax - environment.apiDelayMin + 1)) + environment.apiDelayMin;

    const photos: Photo[] = Array.from({ length: pageSize }, (_, i) => {
      // Deterministic seed ensures the same page always returns the same photos
      const seed = (page - 1) * pageSize + i + 1;
      const width = 400 + (seed % 3) * 100;
      const height = 300 + (seed % 4) * 75;
      return {
        id: `photo-${seed}`,
        url: `${environment.picsumApiBase}/seed/${seed}/${width}/${height}`,
        thumbnailUrl: `${environment.picsumApiBase}/seed/${seed}/400/300`,
        author: this.AUTHORS[seed % this.AUTHORS.length],
        width,
        height,
      };
    });

    return of(photos).pipe(delay(delayMs));
  }
}
