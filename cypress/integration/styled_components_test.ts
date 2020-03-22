describe('Applying external resources', () => {
  before(() => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('styled-components-test').should('exist');
  });

  it('should contain styles', () => {
    cy.shadowGet('styled-components-test')
      .shadowFind('#direflow_styled-components-styles')
      .then((elem) => {
        const [element] = elem;
        const [style] = element.children;
        expect(style.getAttribute('data-styled')).to.equal('active');
      });
  });

  it('should style button correctly', () => {
    cy.shadowGet('styled-components-test')
      .shadowFind('#styled-component-button')
      .then((elem) => {
        const [element] = elem;
        const bgColor = window.getComputedStyle(element, null).getPropertyValue('background-color');
        expect(bgColor).to.equal('rgb(255, 0, 0)');
      });
  });
});
