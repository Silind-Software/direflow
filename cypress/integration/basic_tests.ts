describe('Running basic component without Shadow DOM', () => {
  before(() => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('basic-test').should('exist');
  });

  it('should have default componentTitle', () => {
    cy.shadowGet('basic-test')
      .shadowFind('.app .header-title')
      .shadowContains('Test Setup');
  });

  it('should have default sampleList items', () => {
    cy.shadowGet('basic-test')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(0)
      .shadowContains('Item 1');

    cy.shadowGet('basic-test')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(1)
      .shadowContains('Item 2');

    cy.shadowGet('basic-test')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(2)
      .shadowContains('Item 3');
  });
});
