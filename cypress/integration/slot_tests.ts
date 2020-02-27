describe('Running basic component without Shadow DOM', () => {
  before(() => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('slot-test').should('exist');
  });

  it('should contain a slotted element', () => {
    cy.shadowGet('slot-test')
      .shadowFind('.app .slotted-elements')
      .shadowFind('slot')
      .shadowEq(0)
      .then((element) => {
        const [slotted] = element[0].assignedNodes();
        expect(slotted).contain('Slot Item 1');
      });
  });

  it('should dynamically inject a slotted element', () => {
    cy.shadowGet('slot-test').then((element) => {
      const [component] = element;

      const newSlotted = document.createElement('div');
      newSlotted.innerHTML = 'Slot Item 2';
      newSlotted.slot = 'slotted-item-2';

      component.appendChild(newSlotted);

      cy.shadowGet('slot-test')
        .shadowFind('.app .slotted-elements')
        .shadowFind('slot')
        .shadowEq(1)
        .then((element) => {
          const [slotted] = element[0].assignedNodes();
          expect(slotted).contain('Slot Item 2');
        });
    });
  });
});
