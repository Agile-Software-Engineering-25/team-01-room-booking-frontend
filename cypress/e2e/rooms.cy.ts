describe('Rooms overview tests', () => {
  beforeEach(() => {
    cy.visit('/rooms');
    cy.wait(['@getRooms', '@getBuildings']);
  });

  it('should load and display all rooms', () => {
    cy.contains('Raumsuche');
    cy.contains('Raum 101').should('be.visible');
    cy.contains('Raum 202').should('be.visible');
    cy.contains('Raum 303').should('be.visible');
  });

  it('should filter rooms by search term', () => {
    cy.get('input[placeholder*="Raum"]').type('101');
    cy.contains('Raum 101').should('be.visible');
    cy.contains('Raum 202').should('not.exist');
    cy.contains('Raum 303').should('not.exist');

    cy.get('input[placeholder*="Raum"]').clear().type('2');
    cy.contains('Raum 101').should('not.exist');
    cy.contains('Raum 202').should('be.visible');
    cy.contains('Raum 303').should('not.exist');
  });

  it('should filter rooms by equipment', () => {
    cy.get('[data-testid="inactive-beamer-beamer"]').click();

    cy.contains('Raum 101').should('be.visible');
    cy.contains('Raum 202').should('be.visible');
    cy.contains('Raum 303').should('not.exist');

    cy.get('[data-testid="inactive-smartboard-smartboard"]').click();

    cy.contains('Raum 101').should('not.exist');
    cy.contains('Raum 202').should('be.visible');
    cy.contains('Raum 303').should('not.exist');
  });

  it('should filter rooms by capacity', () => {
    cy.get('[data-testid="inactive-seats-small"]').click();
    cy.contains('Raum 101').should('be.visible');
    cy.contains('Raum 202').should('not.exist');
    cy.contains('Raum 303').should('not.exist');

    cy.get('[data-testid="delete-all-filters"]').click();

    cy.get('[data-testid="inactive-seats-medium"]').click();
    cy.contains('Raum 101').should('not.exist');
    cy.contains('Raum 202').should('be.visible');
    cy.contains('Raum 303').should('not.exist');

    cy.get('[data-testid="delete-all-filters"]').click();

    cy.get('[data-testid="inactive-seats-large"]').click();
    cy.contains('Raum 101').should('not.exist');
    cy.contains('Raum 202').should('not.exist');
    cy.contains('Raum 303').should('be.visible');
  });

  it('should combine multiple filter types', () => {
    cy.get('[data-testid="inactive-seats-small"]').click();
    cy.get('[data-testid="inactive-whiteboard-whiteboard"]').click();

    cy.contains('Raum 101').should('be.visible');
    cy.contains('Raum 202').should('not.exist');
    cy.contains('Raum 303').should('not.exist');
  });

  it('should display active filters correctly', () => {
    cy.get('[data-testid="inactive-beamer-beamer"]').click();

    cy.contains('Aktive Filter').should('be.visible');
    cy.get('[data-testid="beamer-beamer"]').should('exist');

    cy.get('[data-testid="inactive-seats-medium"]').click();
    cy.get('[data-testid="seats-medium"]').should('exist');
  });

  it('should remove filters when clicked again', () => {
    cy.get('[data-testid="inactive-beamer-beamer"]').click();

    cy.contains('Raum 303').should('not.exist');

    cy.get('[data-testid="beamer-beamer"]').click();

    cy.contains('Raum 101').should('be.visible');
    cy.contains('Raum 202').should('be.visible');
    cy.contains('Raum 303').should('be.visible');
  });

  it('should clear all filters', () => {
    cy.get('[data-testid="inactive-beamer-beamer"]').click();
    cy.get('[data-testid="inactive-seats-medium"]').click();

    cy.contains('Aktive Filter').should('be.visible');
    cy.contains('Raum 101').should('not.exist');
    cy.contains('Raum 303').should('not.exist');

    cy.get('[data-testid="delete-all-filters"]').click();

    cy.contains('Raum 101').should('be.visible');
    cy.contains('Raum 202').should('be.visible');
    cy.contains('Raum 303').should('be.visible');

    cy.contains('Aktive Filter').should('not.exist');
  });

  it('should show empty state when no rooms match filter', () => {
    cy.get('input[placeholder*="Raum"]').type('nonexistent');
    cy.contains('Keine Räume gefunden').should('be.visible');
  });
});
