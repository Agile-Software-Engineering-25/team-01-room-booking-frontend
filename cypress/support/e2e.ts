import './commands';

beforeEach(() => {
  cy.intercept('GET', '**/localhost:8080/rooms*', {
    fixture: 'roomsApi/roomsApiData.json',
  }).as('getRooms');
  cy.intercept('GET', '**/localhost:8080/buildings*', {
    fixture: 'buildingsApi/buildingsApiData.json',
  }).as('getBuildings');
});
