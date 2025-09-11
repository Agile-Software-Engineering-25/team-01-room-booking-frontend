import {
  interceptBuildingsApi,
  interceptDeleteBuilding,
  interceptRoomsForBuilding,
  interceptBuildingsListAfterDelete
} from '../support/commands';

describe('Buildings delete tests', () => {
  beforeEach(() => {
    interceptBuildingsApi();
    cy.visit('/buildings');
  });

  it('should delete a building without rooms', () => {
    interceptRoomsForBuilding('building2', false);

    cy.contains('.MuiCard-root', 'B2').within(() => {
      cy.get('[data-testid="B2-delete-button"]').click();
    });

    cy.contains('Gebäude löschen').should('be.visible');

    interceptDeleteBuilding('building2');
    interceptBuildingsListAfterDelete();

    cy.get('[data-testid="delete-building-confirm-button"]').click();
    cy.wait('@deleteBuilding');

    cy.contains('B2').should('not.exist');
    cy.contains('Nebenstraße 2').should('not.exist');
  });

  it('should prevent deletion of a building with rooms', () => {
    interceptRoomsForBuilding('building1', true);

    cy.contains('.MuiCard-root', 'B1').within(() => {
      cy.get('[data-testid="B1-delete-button"]').click();
    });

    cy.contains('Gebäude löschen').should('be.visible');

    cy.contains('Dieses Gebäude enthält Räume und kann nicht gelöscht werden').should('be.visible');

    cy.get('[data-testid="delete-building-confirm-button"]').should('be.disabled');

    cy.get('[data-testid="delete-building-cancel-button"]').click();

    cy.contains('Gebäude löschen').should('not.exist');
  });
});
