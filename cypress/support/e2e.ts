/// <reference types="cypress" />

// Clear localStorage before each test for isolation
beforeEach(() => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});
