describe('Favorites', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for photos to load
    cy.get('app-photo-card', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('should add a photo to favorites via heart button', () => {
    // Hover first card to reveal the favorite button, then click it
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    // Badge on favorites nav should show count
    cy.get('a[aria-label="My favorites"]').find('.mat-badge-content').should('contain', '1');
  });

  it('should show favorited photo on favorites page', () => {
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').click();
    cy.url().should('include', '/favorites');
    cy.get('app-photo-card').should('have.length', 1);
  });

  it('should remove a photo from favorites', () => {
    // Add to favorites
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').click();
    cy.get('app-photo-card').should('have.length', 1);
    // Remove via heart button
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('app-photo-card').should('have.length', 0);
  });

  it('should toggle favorite from gallery without navigating', () => {
    // Add first photo
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').find('.mat-badge-content').should('contain', '1');
    // Remove same photo
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    // Badge count should reset - either badge disappears or shows nothing
    cy.get('a[aria-label="My favorites"]').then(($el) => {
      const badge = $el.find('.mat-badge-content');
      if (badge.length) {
        // If badge element still exists, it should not show a positive number
        expect(badge.text().trim()).to.not.equal('1');
      }
    });
  });

  it('should add multiple photos to favorites', () => {
    cy.get('app-photo-card').eq(0).find('.favorite-btn').click({ force: true });
    cy.get('app-photo-card').eq(1).find('.favorite-btn').click({ force: true });
    cy.get('app-photo-card').eq(2).find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').find('.mat-badge-content').should('contain', '3');
    cy.get('a[aria-label="My favorites"]').click();
    cy.get('app-photo-card').should('have.length', 3);
  });

  it('should persist favorites across page reloads', () => {
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').find('.mat-badge-content').should('contain', '1');
    // Reload the page
    cy.reload();
    cy.get('a[aria-label="My favorites"]', { timeout: 10000 })
      .find('.mat-badge-content')
      .should('contain', '1');
  });

  it('should show empty state on favorites page when no favorites', () => {
    cy.visit('/favorites');
    cy.get('app-photo-card').should('have.length', 0);
  });

  it('should navigate to photo details from favorites page', () => {
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').click();
    cy.get('app-photo-card').first().click();
    cy.url().should('include', '/photos/');
    cy.get('.details-container').should('be.visible');
  });
});
