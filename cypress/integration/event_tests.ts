describe('Delegating events', () => {
  let eventHasFired = false;

  const fireEvent = () => {
    eventHasFired = true;
  };

  before(() => {
    cy.visit('/');
    cy.shadowGet('props-test').then((element) => {
      const [component] = element;
      component.addEventListener('test-click-event', fireEvent);
    });
  });

  it('should contain a custom element', () => {
    cy.get('event-test').should('exist');
  });

  it('should not have fired event', () => {
    expect(eventHasFired).to.equal(false);
  });

  it('should fire event', () => {
    cy.shadowGet('props-test')
      .shadowFind('.app')
      .shadowFind('.button')
      .shadowClick().then(() => {
        expect(eventHasFired).to.equal(true);
      });
  });
});
