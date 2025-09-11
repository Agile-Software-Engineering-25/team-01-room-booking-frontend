/// <reference types="cypress" />

export const interceptBuildingsApi = () => {
  cy.intercept('GET', '**/localhost:8080/buildings', { fixture: 'buildingsApi/buildingsApiData.json' }).as('getBuildings');
};

export const interceptBuildingsListAfterCreate = () => {
  cy.intercept('GET', '**/localhost:8080/buildings', { fixture: 'buildingsApi/buildingsListAfterCreate.json' }).as('getBuildingsAfterCreate');
};

export const interceptBuildingsListAfterEdit = () => {
  cy.intercept('GET', '**/localhost:8080/buildings', { fixture: 'buildingsApi/updatedBuildingsListAfterEdit.json' }).as('getBuildingsAfterEdit');
};

export const interceptBuildingsListAfterDelete = () => {
  cy.intercept('GET', '**/localhost:8080/buildings', { fixture: 'buildingsApi/buildingsListAfterDelete.json' }).as('getBuildingsAfterDelete');
};

export const interceptCreateBuilding = () => {
  cy.intercept('POST', '**/localhost:8080/buildings', {
    statusCode: 201,
    fixture: 'buildingsApi/newBuildingApiData.json'
  }).as('createBuilding');
};

export const interceptUpdateBuilding = (buildingId: string) => {
  cy.intercept('PUT', `**/localhost:8080/buildings/${buildingId}`, {
    statusCode: 200,
    fixture: 'buildingsApi/updatedBuildingApiData.json'
  }).as('updateBuilding');
};

export const interceptDeleteBuilding = (buildingId: string) => {
  cy.intercept('DELETE', `**/localhost:8080/buildings/${buildingId}`, {
    statusCode: 204
  }).as('deleteBuilding');
};

export const interceptRoomsForBuilding = (buildingId: string, hasRooms: boolean) => {
  const fixture = hasRooms ? 'roomsApi/roomsInBuilding.json' : 'roomsApi/emptyRooms.json';
  cy.intercept('GET', `**/localhost:8080/buildings/${buildingId}/rooms`, { fixture }).as('getRoomsForBuilding');
};

declare global {
  namespace Cypress {
    interface Chainable {
    }
  }
}
