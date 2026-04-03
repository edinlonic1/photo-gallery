import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/photos/pages/gallery/gallery.component').then((c) => c.GalleryComponent), title: 'Photo Gallery',
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/favorites/pages/favorites-page/favorites-page.component').then((c) => c.FavoritesPageComponent), title: 'My Favorites',
      },
      {
        path: 'photos/:id',
        loadComponent: () =>
          import('./features/favorites/pages/photo-details/photo-details.component').then((c) => c.PhotoDetailsComponent), title: 'Photo Details',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
