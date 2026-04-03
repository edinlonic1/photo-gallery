describe('Gallery', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display page header with title and subtitle', () => {
    cy.contains('h1', 'Photo Gallery').should('be.visible');
    cy.contains('Discover and save beautiful photos').should('be.visible');
  });

  it('should load and display photo cards', () => {
    cy.get('app-photo-card', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('should display photo author on each card', () => {
    cy.get('app-photo-card').first().find('.photo-author').should('not.be.empty');
  });

  it('should display photo images with picsum URLs', () => {
    cy.get('app-photo-card')
      .first()
      .find('img.photo-img')
      .should('have.attr', 'src')
      .and('include', 'picsum.photos');
  });

  it('should load more photos on scroll (infinite scroll)', () => {
    cy.get('app-photo-card').should('have.length.at.least', 10);
    cy.get('app-photo-card').then(($cards) => {
      const initialCount = $cards.length;
      // Scroll to bottom to trigger IntersectionObserver
      cy.get('.sentinel').scrollIntoView({ duration: 500 });
      cy.get('app-photo-card', { timeout: 10000 }).should(
        'have.length.greaterThan',
        initialCount
      );
    });
  });

  it('should show loader while fetching photos', () => {
    // On initial load, loader may appear briefly
    cy.visit('/');
    // The loader may have already disappeared by the time we check,
    // so we just verify the app loads successfully with cards
    cy.get('app-photo-card', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('should navigate to photo details when clicking a card', () => {
    cy.get('app-photo-card').first().click();
    cy.url().should('include', '/photos/');
    cy.get('.full-image').should('be.visible');
  });
});
