describe('Running basic component without Shadow DOM', () => {
  it('should successfully loads page', () => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('test-setup').should('exist');
  });

  it('should have default componentTitle', () => {
    cy.shadowGet('test-setup')
      .shadowFind('.app .header-title')
      .shadowContains('Test Setup');
  });

  it('should have default sampleList items', () => {
    cy.shadowGet('test-setup')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(0)
      .shadowContains('Item 1');

    cy.shadowGet('test-setup')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(1)
      .shadowContains('Item 2');

    cy.shadowGet('test-setup')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(2)
      .shadowContains('Item 3');
  });
});
