describe('Routing', () => {
  it('should load the gallery on the root path', () => {
    cy.visit('/');
    cy.contains('h1', 'Photo Gallery').should('be.visible');
  });

  it('should navigate to favorites page', () => {
    cy.visit('/');
    cy.get('a[aria-label="My favorites"]').click();
    cy.url().should('include', '/favorites');
    cy.contains('My Favorites').should('exist');
  });

  it('should navigate back to gallery from favorites', () => {
    cy.visit('/favorites');
    cy.contains('button', 'Browse Gallery').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('h1', 'Photo Gallery').should('be.visible');
  });

  it('should navigate to photo details from gallery', () => {
    cy.visit('/');
    cy.get('app-photo-card').first().click();
    cy.url().should('match', /\/photos\/photo-\d+/);
    cy.get('.details-container').should('be.visible');
  });

  it('should navigate back from photo details to gallery', () => {
    cy.visit('/');
    cy.get('app-photo-card').first().click();
    cy.url().should('include', '/photos/');
    cy.contains('button', 'Back').click();
    cy.contains('h1', 'Photo Gallery').should('be.visible');
  });

  it('should redirect unknown routes to gallery', () => {
    cy.visit('/nonexistent-page');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('h1', 'Photo Gallery').should('be.visible');
  });
});
