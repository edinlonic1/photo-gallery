describe('Theme Toggle', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should start in light mode by default', () => {
    cy.get('body').should('not.have.class', 'dark-theme');
  });

  it('should toggle to dark mode', () => {
    cy.get('.theme-toggle').click();
    cy.get('body').should('have.class', 'dark-theme');
  });

  it('should toggle back to light mode', () => {
    cy.get('.theme-toggle').click();
    cy.get('body').should('have.class', 'dark-theme');
    cy.get('.theme-toggle').click();
    cy.get('body').should('not.have.class', 'dark-theme');
  });

  it('should persist dark theme across page reloads', () => {
    cy.get('.theme-toggle').click();
    cy.get('body').should('have.class', 'dark-theme');
    cy.reload();
    cy.get('body', { timeout: 10000 }).should('have.class', 'dark-theme');
  });

  it('should persist light theme across page reloads', () => {
    // Toggle to dark then back to light
    cy.get('.theme-toggle').click();
    cy.get('.theme-toggle').click();
    cy.get('body').should('not.have.class', 'dark-theme');
    cy.reload();
    cy.get('body', { timeout: 10000 }).should('not.have.class', 'dark-theme');
  });

  it('should show correct icon for each theme state', () => {
    // Light mode → show dark_mode icon (to switch to dark)
    cy.get('.theme-toggle mat-icon').should('contain', 'dark_mode');
    cy.get('.theme-toggle').click();
    // Dark mode → show light_mode icon (to switch to light)
    cy.get('.theme-toggle mat-icon').should('contain', 'light_mode');
  });
});
