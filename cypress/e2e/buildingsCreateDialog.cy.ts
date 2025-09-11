import {
  interceptBuildingsApi,
  interceptCreateBuilding,
  interceptBuildingsListAfterCreate
} from '../support/commands';

describe('Buildings create tests', () => {
  beforeEach(() => {
    interceptBuildingsApi();
    cy.visit('/buildings');
  });

  it('should create a new building', () => {
    cy.contains('button', 'Gebäude erstellen').click();

    cy.get('[aria-labelledby="building-create-modal-title"]').should('be.visible');

    cy.get('input[placeholder*="z.B. Hauptgebäude"]').first().type('Neues Gebäude');
    cy.get('input[placeholder*="z.B. Industriepark Höchst"]').first().type('Teststraße 123');
    cy.get('textarea[placeholder*="Beschreibung des Gebäudes"]').first().type('Beschreibung für das neue Gebäude');

    interceptCreateBuilding();
    interceptBuildingsListAfterCreate();

    cy.get('[data-testid="create-building-submit-button"]').click();

    cy.wait('@createBuilding');

    cy.get('[aria-labelledby="building-create-modal-title"]').should('not.exist');

    cy.contains('Neues Gebäude').should('be.visible');
    cy.contains('Teststraße 123').should('be.visible');
  });
});
