import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavoritesStore } from '../../core/stores/favorites.store';

/** Scroll distance (px) before scroll-to-top button appears */
const SCROLL_THRESHOLD = 60;

/**
 * App header with navigation, favorites badge, theme toggle,
 * and a scroll-to-top button.
 */
@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly favoritesStore = inject(FavoritesStore);
  private scrollListener: (() => void) | null = null;

  /** Exposes the favorites count signal for the badge */
  readonly favoritesCount = this.favoritesStore.count;

  /** Tracks current theme state; persisted to localStorage */
  readonly isDark = signal(false);

  /** True when user has scrolled past the threshold */
  readonly isScrolled = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('photo_library_theme');
    if (savedTheme === 'dark') {
      this.isDark.set(true);
      document.body.classList.add('dark-theme');
    }
  }

  ngOnInit(): void {
    const handler = () => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      if (scrolled !== this.isScrolled()) {
        this.isScrolled.set(scrolled);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    this.scrollListener = () => window.removeEventListener('scroll', handler);
  }

  ngOnDestroy(): void {
    this.scrollListener?.();
  }

  toggleTheme(): void {
    this.isDark.update((v) => !v);
    if (this.isDark()) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('photo_library_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('photo_library_theme', 'light');
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
