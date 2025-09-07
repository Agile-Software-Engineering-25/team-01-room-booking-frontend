describe('RoomCreateDialog tests', () => {
  beforeEach(() => {
    cy.visit('/rooms');
    cy.wait(['@getRooms', '@getBuildings']);

    cy.intercept('POST', '**/rooms', {
      statusCode: 201,
      fixture: 'createRoomApiData.json',
    }).as('createRoom');

    // Öffne den Dialog
    cy.contains('button', /Raum erstellen|Create room/).click();
  });

  it('should open dialog when create button is clicked', () => {
    cy.contains(/Neuen Raum erstellen|Create new room/).should('be.visible');
    cy.contains(/Raumnummer|Room number/).should('be.visible');
    cy.contains(/Gebäude|Building/).should('be.visible');
    cy.contains(/Kapazität|Capacity/).should('be.visible');
  });

  it('should disable submit button when required fields are empty', () => {
    cy.get('[data-testid="create-room-submit-button"]')
      .should('be.disabled');

    // Nur Raumnummer eingeben
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.get('[data-testid="create-room-submit-button"]')
      .should('be.disabled');

    // Nur Gebäude auswählen
    cy.get('input[placeholder*="1.21"]').clear();
    cy.contains(/Gebäude auswählen|Select building/).parent().click();
    cy.contains('li', /B1/).click();
    cy.get('[data-testid="create-room-submit-button"]')
      .should('be.disabled');

    // Nur Kapazität eingeben
    cy.get('input[type="number"]').type('20');
    cy.get('[data-testid="create-room-submit-button"]')
      .should('be.disabled');
  });

  it('should enable submit button when all required fields are filled', () => {
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/).parent().click();
    cy.contains('li', /B1/).click();
    cy.get('input[type="number"]').type('20');

    cy.get('[data-testid="create-room-submit-button"]')
      .should('not.be.disabled');
  });

  it('should add standard equipment when clicked', () => {
    // Füge Whiteboard hinzu
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.contains(/Aktive Filter|Active filters/).should('be.visible');
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]')
      .should('have.css', 'background-color')
      .and('not.equal', 'rgba(0, 0, 0, 0)');

    // Füge PC hinzu
    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="remove-equipment-PC-button"]')
      .should('have.css', 'background-color')
      .and('not.equal', 'rgba(0, 0, 0, 0)');
  });

  it('should remove equipment when clicked again', () => {
    // Füge Whiteboard hinzu und entferne es wieder
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]')
      .should('be.visible')
      .click();

    // Aktive Filter sollten jetzt nicht mehr sichtbar sein
    cy.contains(/Aktive Filter|Active filters/).should('not.exist');
  });

  it('should open custom equipment form when custom button is clicked', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.contains(/Eigene Ausstattung hinzufügen|Add custom equipment/).should('be.visible');
    cy.get('input[placeholder*="Typ"]').should('be.visible');
  });

  it('should prevent adding standard equipment as custom', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('WHITEBOARD');

    // Das Eingabefeld sollte einen Fehler anzeigen
    cy.get('input[placeholder*="Typ"]').should('have.attr', 'aria-invalid', 'true');

    // Der Hinzufügen-Button sollte deaktiviert sein
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .should('be.disabled');
  });

  it('should add custom equipment with boolean value', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('PROJECTOR');
    cy.contains(/Boolean/).parent().click();
    cy.contains(/Ja|Yes/).click();
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .click();

    // Das neue Equipment sollte sichtbar sein
    cy.contains('div[role="button"]', /Projector/i).should('be.visible');
  });

  it('should add custom equipment with number value', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('HDMI_PORTS');
    cy.contains(/Boolean/).parent().click();
    cy.contains(/Zahl|Number/).click();
    cy.get('input[type="number"]').last().type('4');
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .click();

    // Das neue Equipment sollte sichtbar sein
    cy.contains('div[role="button"]', /Hdmi ports: 4/i).should('be.visible');
  });

  it('should add custom equipment with string value', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('NETWORK');
    cy.contains(/Boolean/).parent().click();
    cy.contains(/Text/).click();
    cy.get('input[placeholder*="Wert"]').type('WLAN');
    cy.contains('button', /Hinzufügen|Add/)
      .first()
      .click();

    // Das neue Equipment sollte sichtbar sein
    cy.contains('div[role="button"]', /Network: WLAN/i).should('be.visible');
  });

  it('should create a new room successfully', () => {
    // Pflichtfelder ausfüllen
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/).parent().click();
    cy.contains('li', /B1/).click();
    cy.get('input[type="number"]').type('20');

    // Standardausrüstung hinzufügen
    cy.contains(/Whiteboard/i).click();
    cy.contains(/PC/i).click();

    // Raum erstellen
    cy.get('[data-testid="create-room-submit-button"]')
      .click();

    // API-Aufruf abwarten und überprüfen
    cy.wait('@createRoom').its('request.body').should('deep.include', {
      name: '101',
      characteristics: [
        { type: 'SEATS', value: 20 },
        { type: 'WHITEBOARD', value: true },
        { type: 'PC', value: true }
      ]
    });

    // Dialog sollte nach erfolgreicher Erstellung geschlossen sein
    cy.contains(/Neuen Raum erstellen|Create new room/).should('not.exist');
  });

  it('should reset form when dialog is closed', () => {
    // Formular ausfüllen
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/).parent().click();
    cy.contains('li', /B1/).click();
    cy.get('input[type="number"]').type('20');
    cy.contains(/Whiteboard/i).click();

    // Dialog schließen
    cy.get('button[aria-label="Close"]').click();

    // Dialog erneut öffnen
    cy.contains('button', /Raum erstellen|Create room/).click();

    // Formular sollte zurückgesetzt sein
    cy.get('input[placeholder*="1.21"]').should('have.value', '');
    cy.get('input[type="number"]').should('have.value', '');
    cy.contains(/Aktive Filter|Active filters/).should('not.exist');
  });

  it('should show all equipment options in dialog even with small viewport', () => {
    // Simuliere einen kleinen Bildschirm
    cy.viewport(400, 600);

    // Alle Standard-Equipment-Optionen sollten sichtbar sein
    cy.get('[data-testid="add-equipment-PC-button"]').should('be.visible');
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').should('be.visible');
    cy.get('[data-testid="add-equipment-BEAMER-button"]').should('be.visible');
    cy.get('[data-testid="add-equipment-TELEVISION-button"]').should('be.visible');
    cy.get('[data-testid="add-custom-equipment-button"]').should('be.visible');
  });

  it('should maintain equipment visibility when multiple items are added', () => {
    // Füge alle Standard-Equipment hinzu
    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.get('[data-testid="add-equipment-BEAMER-button"]').click();
    cy.get('[data-testid="add-equipment-TELEVISION-button"]').click();

    // Benutzerdefinierte Equipment hinzufügen
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('CAMERA');
    cy.get('input[placeholder*="Wert"]').type('true');
    cy.contains('button', /Hinzufügen|Add/).first().click();

    // Alle hinzugefügten Equipment sollten sichtbar sein
    cy.get('[data-testid="remove-equipment-PC-button"]').should('be.visible');
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]').should('be.visible');
    cy.get('[data-testid="remove-equipment-BEAMER-button"]').should('be.visible');
    cy.get('[data-testid="remove-equipment-TELEVISION-button"]').should('be.visible');
    cy.get('[data-testid="remove-equipment-CAMERA-button"]').should('be.visible');

    // Submit-Button sollte noch sichtbar sein
    cy.get('[data-testid="create-room-submit-button"]').should('be.visible');
  });

  it('should handle responsive layout for custom equipment form', () => {
    // Teste auf kleinem Bildschirm
    cy.viewport(400, 600);

    cy.get('[data-testid="add-custom-equipment-button"]').click();

    // Form-Elemente sollten sichtbar und nutzbar sein
    cy.get('input[placeholder*="Typ"]').should('be.visible').type('MICROPHONE');

    // Typ-Dropdown sollte funktionieren
    cy.contains(/Boolean/).parent().click();
    cy.contains(/Text/).click();

    // Wert-Input sollte sichtbar sein
    cy.get('input[placeholder*="Wert"]').should('be.visible').type('Wireless');

    // Buttons sollten sichtbar und klickbar sein
    cy.contains('button', /Hinzufügen|Add/).first().should('be.visible').click();
    cy.contains('div[role="button"]', /Microphone: Wireless/i).should('be.visible');
  });

  it('should scroll to show all content when dialog is full', () => {
    // Viewport verkleinern
    cy.viewport(500, 400);

    // Viele Equipment hinzufügen
    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();
    cy.get('[data-testid="add-equipment-BEAMER-button"]').click();

    // Scroll zu den Buttons am Ende
    cy.get('[data-testid="create-room-submit-button"]').scrollIntoView();
    cy.get('[data-testid="create-room-submit-button"]').should('be.visible');

    // Scroll zurück zu den Equipment-Optionen
    cy.contains(/Standard-Ausstattung|Standard equipment/).scrollIntoView();
    cy.get('[data-testid="add-equipment-TELEVISION-button"]').should('be.visible');
  });

  it('should prevent duplicate custom equipment types', () => {
    // Füge benutzerdefiniertes Equipment hinzu
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('SPEAKER');
    cy.get('input[placeholder*="Wert"]').type('true');
    cy.contains('button', /Hinzufügen|Add/).first().click();

    // Versuche das gleiche Equipment nochmal hinzuzufügen
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('SPEAKER');
    cy.get('input[placeholder*="Wert"]').type('false');
    cy.contains('button', /Hinzufügen|Add/).first().click();

    // Nur ein SPEAKER-Equipment sollte existieren (das letzte überschreibt das erste)
    cy.get('[data-testid="remove-equipment-SPEAKER-button"]').should('have.length', 1);
  });

  it('should validate number input for custom equipment', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('PORTS');

    // Wähle Number-Typ
    cy.contains(/Boolean/).parent().click();
    cy.contains(/Zahl|Number/).click();

    // Gib ungültigen Wert ein
    cy.get('input[type="number"]').last().type('abc');

    // Button sollte deaktiviert sein
    cy.contains('button', /Hinzufügen|Add/).first().should('be.disabled');

    // Gib gültigen Wert ein
    cy.get('input[type="number"]').last().clear().type('5');
    cy.contains('button', /Hinzufügen|Add/).first().should('not.be.disabled');
  });

  it('should cancel custom equipment form without adding', () => {
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.get('input[placeholder*="Typ"]').type('CANCELLED');
    cy.get('input[placeholder*="Wert"]').type('test');

    // Abbrechen
    cy.contains('button', /Abbrechen|Cancel/).click();

    // Form sollte geschlossen sein
    cy.get('input[placeholder*="Typ"]').should('not.exist');

    // Equipment sollte nicht hinzugefügt worden sein
    cy.contains(/CANCELLED/).should('not.exist');
  });

  it('should maintain selected equipment when switching between standard and custom', () => {
    // Standard Equipment hinzufügen
    cy.get('[data-testid="add-equipment-PC-button"]').click();
    cy.get('[data-testid="add-equipment-WHITEBOARD-button"]').click();

    // Custom Equipment Form öffnen und schließen
    cy.get('[data-testid="add-custom-equipment-button"]').click();
    cy.contains('button', /Abbrechen|Cancel/).click();

    // Standard Equipment sollte noch ausgewählt sein
    cy.get('[data-testid="remove-equipment-PC-button"]').should('be.visible');
    cy.get('[data-testid="remove-equipment-WHITEBOARD-button"]').should('be.visible');
  });

  it('should handle seats requirement correctly', () => {
    // Fülle alle Felder außer Seats aus
    cy.get('input[placeholder*="1.21"]').type('101');
    cy.contains(/Gebäude auswählen|Select building/).parent().click();
    cy.contains('li', /B1/).click();

    // Submit sollte deaktiviert sein (Seats = 0)
    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');

    // Ungültige Seats eingeben
    cy.get('input[type="number"]').type('-5');
    cy.get('[data-testid="create-room-submit-button"]').should('be.disabled');

    // Gültige Seats eingeben
    cy.get('input[type="number"]').clear().type('25');
    cy.get('[data-testid="create-room-submit-button"]').should('not.be.disabled');
  });
});
