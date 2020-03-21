describe('Applying external resources', () => {
  before(() => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('external-loader-test').should('exist');
  });

  it('should have script tag in head', () => {
    cy.get('head script[src="https://code.jquery.com/jquery-3.3.1.slim.min.js"]').should('exist');
  });

  it('should have async script tag in head', () => {
    cy.get(
      'head script[src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"]',
    ).should('have.attr', 'async');
  });

  it('should contain external styles', () => {
    cy.shadowGet('external-loader-test')
      .shadowFind('#direflow_external-styles')
      .then((elem) => {
        const [element] = elem;
        const [link] = element.children;
        expect(link.href).to.equal(
          'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
        );
      });
  });
});
