describe('RoomCreateDialog tests', () => {
  beforeEach(() => {
    cy.visit('/rooms');
    cy.wait(['@getRooms', '@getBuildings']);

    cy.intercept('POST', '**/localhost:8080/rooms', {
      statusCode: 201,
      fixture: 'roomsApi/createRoomApiData.json',
    }).as('createRoom');

    cy.contains('button', /Raum erstellen|Create room/).click();
  });

  it('should open dialog when create button is clicked', () => {
    cy.contains(/Neuen Raum erstellen|Create new room/).should('be.visible');
    cy.contains(/Raumnummer|Room number/).should('be.visible');
    cy.contains(/Gebäude|Building/).should('be.visible');
    cy.contains(/Kapazität|Capacity/).should('be.visible');
  });

  it('should disable submit button when required fields are empty', () => {
    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');

    cy.get('input[placeholder*="1.21"]').type('101');
    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');

    cy.get('input[placeholder*="1.21"]').clear();
    cy.contains(/Gebäude auswählen|Select building/)
      .parent()
      .click();
    cy.contains('li', /B1/).click();
    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');

    cy.get('input[type="number"]').type('20');
    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');
  });

  it('should enable submit button when all required fields are filled', () => {
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/)
      .parent()
      .click();
    cy.contains('li', /B1/).click();
    cy.get('input[type="number"]').type('20');
    cy.get('input[placeholder="z.B. Ferrum"]').type('Ferrum');

    cy.get('[data-testid="create-room-submit-button"]').should(
      'not.be.disabled'
    );
  });

  it('should add standard equipment when clicked', () => {
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.contains(/Ausgewählte Ausstattung|Selected equipment/).should('be.visible');
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]')
      .should('have.css', 'background-color')
      .and('not.equal', 'rgba(0, 0, 0, 0)');

    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="remove-equipment-PC-button"]')
      .should('have.css', 'background-color')
      .and('not.equal', 'rgba(0, 0, 0, 0)');
  });

  it('should remove equipment when clicked again', () => {
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]')
      .should('be.visible')
      .click();

    cy.contains(/Ausgewählte Ausstattung|Selected equipment/).should('not.exist');
  });

  it('should open custom equipment form when custom button is clicked', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.contains(/Eigene Ausstattung hinzufügen|Add custom equipment/).should(
      'be.visible'
    );
    cy.get('input[placeholder*="Typ"]').should('be.visible');
  });

  it('should prevent adding standard equipment as custom', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('WHITEBOARD');

    cy.get('input[placeholder*="Typ"]').should(
      'have.attr',
      'aria-invalid',
      'true'
    );

    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .should('be.disabled');
  });

  it('should add custom equipment with boolean value', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('PROJECTOR');
    cy.contains(/Boolean/)
      .parent()
      .click();
    cy.get('button[role="combobox"]')
      .contains(/Wert|Value/)
      .click();
    cy.contains(/Ja|Yes/).click();
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .click();

    cy.get('[data-testid="remove-equipment-PROJECTOR-button"]')
      .should('be.visible')
      .next()
      .contains(/Projector/);
  });

  it('should add custom equipment with number value', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('HDMI_PORTS');
    cy.contains(/Boolean/)
      .parent()
      .click();
    cy.contains(/Zahl|Number/).click();
    cy.get('input[type="number"]').last().type('4');
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .click();

    cy.get('[data-testid="remove-equipment-HDMI_PORTS-button"]')
      .should('be.visible')
      .next()
      .contains(/Hdmi_ports: 4/i);
  });

  it('should add custom equipment with string value', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('NETWORK');
    cy.contains(/Boolean/)
      .parent()
      .click();
    cy.contains(/Text/).click();
    cy.get('input[placeholder*="Wert"]').type('WLAN');
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .click();

    cy.get('[data-testid="remove-equipment-NETWORK-button"]')
      .should('be.visible')
      .next()
      .contains(/Network: WLAN/i);
  });

  it('should create a new room successfully', () => {
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/)
      .parent()
      .click();
    cy.contains('li', /B1/).click();
    cy.get('input[type="number"]').type('20');
    cy.get('input[placeholder="z.B. Ferrum"]').type('Ferrum');

    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.get('[data-testid="add-equipment-PC-button"]').click();

    cy.get('[data-testid="create-room-submit-button"]').click();

    cy.wait('@createRoom')
      .its('request.body')
      .should('deep.include', {
        name: '101',
        characteristics: [
          { type: 'SEATS', value: 20 },
          { type: 'WHITEBOARD', value: true },
          { type: 'PC', value: true },
        ],
      });
    cy.contains(/Neuen Raum erstellen|Create new room/).should('not.exist');
  });

  it('should reset form when dialog is closed', () => {
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/)
      .parent()
      .click();
    cy.contains('li', /B1/).click();
    cy.get('input[type="number"]').type('20');
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();

    cy.get('[data-testid="create-room-cancel-button"]').click();

    cy.contains('button', /Raum erstellen|Create room/).click();

    cy.get('input[placeholder*="1.21"]').should('have.value', '');
    cy.get('input[type="number"]').should('have.value', '');
    cy.contains(/Ausgewählte Ausstattung|Selected equipment/).should('not.exist');
  });

  it('should show all equipment options in dialog even with small viewport', () => {
    cy.viewport(400, 600);

    cy.get('[data-testid="add-equipment-PC-button"]').scrollIntoView()
      .should('be.visible');
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]')
      .should('be.visible');
    cy.get('[data-testid="add-equipment-BEAMER-button"]').should('be.visible');
    cy.get('[data-testid="add-equipment-TELEVISION-button"]').should(
      'be.visible'
    );
    cy.get('[data-testid="add-custom-equipment-button"]')
      .scrollIntoView()
      .should('be.visible');
  });

  it('should maintain equipment visibility when multiple items are added', () => {
    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.get('[data-testid="add-equipment-BEAMER-button"]').click();
    cy.get('[data-testid="add-equipment-TELEVISION-button"]').click();

    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('CAMERA');
    cy.get('button[role="combobox"]')
      .contains(/Wert|Value/)
      .click();
    cy.contains(/Ja|Yes|true/i).click();
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .click();

    cy.get('[data-testid="remove-equipment-PC-button"]').should('be.visible');
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]').should(
      'be.visible'
    );
    cy.get('[data-testid="remove-equipment-BEAMER-button"]').should(
      'be.visible'
    );
    cy.get('[data-testid="remove-equipment-TELEVISION-button"]').should(
      'be.visible'
    );
    cy.get('[data-testid="remove-equipment-CAMERA-button"]')
      .should('be.visible')
      .next()
      .contains(/Camera/i);

    cy.get('[data-testid="create-room-submit-button"]').should('be.visible');
  });

  it('should handle responsive layout for custom equipment form', () => {
    cy.viewport(400, 600);

    cy.get('[data-testid="add-custom-equipment-button"]').click();

    cy.get('input[placeholder*="Typ"]').should('be.visible').type('MICROPHONE');

    cy.contains(/Boolean/)
      .parent()
      .click();
    cy.contains(/Text/).click();

    cy.get('input[placeholder*="Wert"]').should('be.visible').type('Wireless');

    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .should('be.visible')
      .click();
  });

  it('should scroll to show all content when dialog is full', () => {
    cy.viewport(500, 400);

    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.get('[data-testid="add-equipment-BEAMER-button"]').click();

    cy.get('[data-testid="create-room-submit-button"]').scrollIntoView();
    cy.get('[data-testid="create-room-submit-button"]').should('be.visible');

    cy.contains(/Standard-Ausstattung|Standard equipment/).scrollIntoView();
    cy.get('[data-testid="add-equipment-TELEVISION-button"]').should(
      'be.visible'
    );
  });

  it('should prevent duplicate custom equipment types', () => {
    const createSpeakerEquipment = () => {
      cy.get('[data-testid="add-custom-equipment-button"]').click();
      cy.get('input[placeholder*="Typ"]').type('SPEAKER');
      cy.get('button[role="combobox"]')
        .contains(/Wert|Value/)
        .click();
      cy.contains(/Ja|Yes|true/i).click();
      cy.contains('button', /Hinzufügen|Add/)
        .first()
        .click();
    };

    createSpeakerEquipment();
    createSpeakerEquipment();

    cy.get('[data-testid="remove-equipment-SPEAKER-button"]').should(
      'have.length',
      1
    );
  });

  it('should validate number input for custom equipment', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('SPEAKER');
    cy.contains(/Boolean/)
      .parent()
      .click();
    cy.contains(/Zahl|Number/).click();

    cy.get('input[type="number"]').last().type('abc');

    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .should('be.disabled');

    cy.get('input[type="number"]').last().clear().type('5');
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .should('not.be.disabled');
  });

  it('should cancel custom equipment form without adding', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('CANCELLED');
    cy.contains(/Boolean/)
      .parent()
      .click();
    cy.contains(/Text/).click();
    cy.get('input[placeholder*="Wert"]').type('test');

    cy.contains('button', /Abbrechen|Cancel/).click();

    cy.get('input[placeholder*="Typ"]').should('not.exist');

    cy.contains(/CANCELLED/).should('not.exist');
  });

  it('should maintain selected equipment when switching between standard and custom', () => {
    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();

    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.contains('button', /Abbrechen|Cancel/).click();

    cy.get('[data-testid="remove-equipment-PC-button"]').should('be.visible');
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]').should(
      'be.visible'
    );
  });

  it('should handle seats requirement correctly', () => {
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/)
      .parent()
      .click();
    cy.contains('li', /B1/).click();
    cy.get('input[placeholder="z.B. Ferrum"]').type('Ferrum');

    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');

    cy.get('input[type="number"]').type('-5');
    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');

    cy.get('input[type="number"]').clear().type('25');
    cy.get('[data-testid="create-room-submit-button"]').should(
      'not.be.disabled'
    );
  });
});
