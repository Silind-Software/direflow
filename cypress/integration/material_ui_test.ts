describe('Applying external resources', () => {
  before(() => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('material-ui-test').should('exist');
  });

  it('should contain styles', () => {
    cy.shadowGet('material-ui-test')
      .shadowFind('#direflow_material-ui-styles')
      .then((elem) => {
        const [element] = elem;
        expect(element).not.to.be.undefined;
      });
  });

  it('should style button correctly', () => {
    cy.shadowGet('material-ui-test')
      .shadowFind('#material-ui-button')
      .then((elem) => {
        const [element] = elem;
        const bgColor = window.getComputedStyle(element, null).getPropertyValue('background-color');
        expect(bgColor).to.equal('rgb(63, 81, 181)');
      });
  });
});
