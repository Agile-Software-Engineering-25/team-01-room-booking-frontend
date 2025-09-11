import { interceptBuildingsApi } from '../support/commands';

describe('Buildings display tests', () => {
  beforeEach(() => {
    interceptBuildingsApi();
    cy.visit('/buildings');
  });

  it('should display the buildings list', () => {
    cy.get('h4').should('contain', 'Gebäudesuche');
    cy.get('.MuiCard-root').should('have.length.at.least', 2);
    cy.contains('B1').should('be.visible');
    cy.contains('B2').should('be.visible');
    cy.contains('Hauptstraße 1').should('be.visible');
    cy.contains('Nebenstraße 2').should('be.visible');
  });

  it('should search for buildings', () => {
    cy.get('input[placeholder*="Nach Gebäudename suchen"]').type('B1');
    cy.contains('B1').should('be.visible');
    cy.contains('B2').should('not.exist');

    cy.get('input[placeholder*="Nach Gebäudename suchen"]').clear();
    cy.contains('B1').should('be.visible');
    cy.contains('B2').should('be.visible');
  });
});
