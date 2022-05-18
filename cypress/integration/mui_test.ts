describe('Applying external resources', () => {
  before(() => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('mui-test').should('exist');
  });

  it('should contain styles', () => {
    cy.shadowGet('mui-test')
      .shadowFind('#direflow_mui-styles')
      .then((elem) => {
        const [element] = elem;
        expect(element).not.to.be.undefined;
      });
  });

  it('should style button correctly', () => {
    cy.shadowGet('mui-test')
      .shadowFind('#mui-button')
      .then((elem) => {
        const [element] = elem;
        const bgColor = window.getComputedStyle(element, null).getPropertyValue('background-color');
        expect(bgColor).to.equal('rgb(63, 81, 181)');
      });
  });
});
