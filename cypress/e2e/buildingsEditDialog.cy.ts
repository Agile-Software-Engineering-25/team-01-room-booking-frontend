import {
  interceptBuildingsApi,
  interceptUpdateBuilding,
  interceptBuildingsListAfterEdit
} from '../support/commands';

describe('Buildings edit tests', () => {
  beforeEach(() => {
    interceptBuildingsApi();
    cy.visit('/buildings');
  });

  it('should edit a building', () => {
    cy.contains('.MuiCard-root', 'B1').within(() => {
      cy.get('[data-testid="B1-edit-button"]').click();
    });

    cy.get('[aria-labelledby="building-edit-modal-title"]').should('be.visible');

    cy.get('input[placeholder*="z.B. Hauptgebäude"]').first().should('have.value', 'B1');
    cy.get('input[placeholder*="z.B. Industriepark Höchst"]').first().should('have.value', 'Hauptstraße 1');
    cy.get('textarea[placeholder*="Beschreibung des Gebäudes"]').first().should('have.value', 'Hauptgebäude');

    cy.get('input[placeholder*="z.B. Hauptgebäude"]').first().clear().type('B1 Aktualisiert');
    cy.get('input[placeholder*="z.B. Industriepark Höchst"]').first().clear().type('Neue Hauptstraße 1A');
    cy.get('textarea[placeholder*="Beschreibung des Gebäudes"]').first().clear().type('Aktualisierte Beschreibung');

    interceptUpdateBuilding('building1');
    interceptBuildingsListAfterEdit();

    cy.get('[data-testid="edit-building-submit-button"]').click();

    cy.wait('@updateBuilding');

    cy.get('[aria-labelledby="building-edit-modal-title"]').should('not.exist');

    cy.contains('B1 Aktualisiert').should('be.visible');
    cy.contains('Neue Hauptstraße 1A').should('be.visible');
  });
});
