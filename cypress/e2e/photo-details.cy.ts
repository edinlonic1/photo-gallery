describe('Photo Details', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('app-photo-card', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('should display full-size image', () => {
    cy.get('app-photo-card').first().click();
    cy.get('.full-image')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'picsum.photos');
  });

  it('should display photo author and dimensions', () => {
    cy.get('app-photo-card').first().click();
    cy.get('.photo-info .author').should('not.be.empty');
    cy.get('.photo-info .dimensions').should('not.be.empty');
  });

  it('should show add-to-favorites button when photo is not favorited', () => {
    cy.get('app-photo-card').first().click();
    cy.get('button[aria-label="Add to favorites"]').should('be.visible');
  });

  it('should add to favorites from details view', () => {
    cy.get('app-photo-card').first().click();
    cy.get('button[aria-label="Add to favorites"]').click();
    cy.contains('Added to favorites').should('be.visible');
    cy.get('button[aria-label="Remove from favorites"]').should('be.visible');
  });

  it('should remove from favorites from details view', () => {
    cy.get('app-photo-card').first().click();
    cy.get('button[aria-label="Add to favorites"]').click();
    cy.get('button[aria-label="Remove from favorites"]').click();
    cy.contains('Removed from favorites').should('be.visible');
    cy.get('button[aria-label="Add to favorites"]').should('be.visible');
  });

  it('should show remove-from-favorites button when opened from favorites', () => {
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').click();
    cy.get('app-photo-card').first().click();
    cy.get('button[aria-label="Remove from favorites"]').should('be.visible');
  });

  it('should navigate back to gallery when opened from gallery', () => {
    cy.get('app-photo-card').first().click();
    cy.contains('button', 'Back').click();
    cy.contains('h1', 'Photo Gallery').should('be.visible');
  });

  it('should navigate back to favorites when opened from favorites', () => {
    cy.get('app-photo-card').first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').click();
    cy.get('app-photo-card').first().click();
    cy.contains('button', 'Back').click();
    cy.url().should('include', '/favorites');
  });

  it('should show not-found state for invalid photo ID', () => {
    cy.visit('/photos/nonexistent-id-99999');
    cy.contains('Photo not found').should('be.visible');
  });

  it('should display the download button', () => {
    cy.get('app-photo-card').first().click();
    cy.get('button[aria-label="Download photo"]').should('be.visible');
    cy.get('button[aria-label="Download photo"] mat-icon').should('contain', 'download');
  });

  it('should trigger download and show confirmation snackbar', () => {
    cy.get('app-photo-card').first().click();
    cy.get('button[aria-label="Download photo"]').should('be.visible');

    // Stub the fetch to return a blob so we don't actually download
    cy.window().then((win) => {
      cy.stub(win, 'fetch').resolves(new Response(new Blob(['fake'], { type: 'image/jpeg' })));
    });

    cy.get('button[aria-label="Download photo"]').click();
    cy.contains('Download started').should('be.visible');
  });

  it('should show downloading state while fetching', () => {
    cy.get('app-photo-card').first().click();

    // Stub fetch with a delayed response
    cy.window().then((win) => {
      cy.stub(win, 'fetch').returns(
        new Promise((resolve) =>
          setTimeout(() => resolve(new Response(new Blob(['fake']))), 2000)
        )
      );
    });

    cy.get('button[aria-label="Download photo"]').click();
    // Icon should change to hourglass while downloading
    cy.get('button[aria-label="Download photo"] mat-icon').should('contain', 'hourglass_empty');
  });
});

