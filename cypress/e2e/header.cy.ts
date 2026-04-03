describe('Header & Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the header with brand name', () => {
    cy.get('.brand-name').should('contain', 'Photo Gallery');
  });

  it('should have a sticky header', () => {
    cy.get('app-photo-card', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.scrollTo('bottom');
    cy.get('app-header').should('be.visible');
  });

  it('should highlight active nav link for gallery', () => {
    cy.get('a[aria-label="Photos gallery"]').should('have.class', 'active-link');
    cy.get('a[aria-label="My favorites"]').should('not.have.class', 'active-link');
  });

  it('should highlight active nav link for favorites', () => {
    cy.get('a[aria-label="My favorites"]').click();
    cy.get('a[aria-label="My favorites"]').should('have.class', 'active-link');
    cy.get('a[aria-label="Photos gallery"]').should('not.have.class', 'active-link');
  });

  it('should show favorites badge when favorites exist', () => {
    // No badge initially
    cy.get('a[aria-label="My favorites"]')
      .find('.mat-badge-content')
      .should('not.exist');

    // Add a favorite
    cy.get('app-photo-card', { timeout: 10000 }).first().find('.favorite-btn').click({ force: true });
    cy.get('a[aria-label="My favorites"]').find('.mat-badge-content').should('contain', '1');
  });

  it('should show scroll-to-top button after scrolling', () => {
    cy.get('.scroll-to-top').should('not.exist');
    cy.scrollTo(0, 300);
    cy.get('.scroll-to-top').should('be.visible');
  });

  it('should scroll to top when clicking scroll-to-top button', () => {
    cy.get('app-photo-card', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.scrollTo(0, 500);
    cy.get('.scroll-to-top').should('be.visible').click();
    // Give smooth scroll time to complete
    cy.wait(500);
    cy.window().its('scrollY').should('be.lessThan', 10);
  });

  it('should navigate home when clicking the brand logo', () => {
    cy.get('a[aria-label="My favorites"]').click();
    cy.url().should('include', '/favorites');
    cy.get('.brand-link').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
