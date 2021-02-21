describe('Using properties and attributes', () => {
  before(() => {
    cy.visit('/');
  });

  const assertSampleList = (id, assertions) => {
    cy.shadowGet(id)
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(0)
      .shadowContains(assertions[0]);

    cy.shadowGet(id)
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(1)
      .shadowContains(assertions[1]);

    cy.shadowGet(id)
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(2)
      .shadowContains(assertions[2]);
  };

  it('should contain a custom element', () => {
    cy.get('#props-test-1').should('exist');
  });

  it('should have default componentTitle', () => {
    cy.shadowGet('#props-test-1')
      .shadowFind('.app')
      .shadowFind('.header-title')
      .shadowContains('Props Title');
  });

  it('should contain a custom element', () => {
    cy.get('#props-test-1').should('exist');
  });

  it('setting componentTitle property should update componentTitle', () => {
    cy.shadowGet('#props-test-1').then((element) => {
      const [component] = element;
      component.componentTitle = 'Update Title';

      cy.shadowGet('#props-test-1')
        .shadowFind('.app')
        .shadowFind('.header-title')
        .shadowContains('Update Title');
    });
  });

  it('setting componenttitle attribute should update componentTitle', () => {
    cy.shadowGet('#props-test-1').then((element) => {
      const [component] = element;
      component.setAttribute('componenttitle', 'Any');

      cy.shadowGet('#props-test-1')
        .shadowFind('.app')
        .shadowFind('.header-title')
        .shadowContains('Any');
    });
  });

  it('should update componentTitle with delay', () => {
    cy.shadowGet('#props-test-1')
      .shadowFind('.app')
      .shadowFind('.header-title')
      .shadowContains('Any');

    cy.wait(500);

    cy.shadowGet('#props-test-1').then((element) => {
      const [component] = element;
      component.componentTitle = 'Delay Title';

      cy.shadowGet('#props-test-1')
        .shadowFind('.app')
        .shadowFind('.header-title')
        .shadowContains('Delay Title');
    });
  });

  it('should update sampleList items', () => {
    cy.shadowGet('#props-test-1').then((element) => {
      const [component] = element;
      const samples = ['New Item 1', 'New Item 2', 'New Item 3'];
      component.sampleList = samples;

      assertSampleList('#props-test-1', samples);
    });
  });

  it('should update sampleList items with delay', () => {
    const currentSamples = ['New Item 1', 'New Item 2', 'New Item 3'];
    assertSampleList('#props-test-1', currentSamples);

    cy.wait(500);

    cy.shadowGet('#props-test-1').then((element) => {
      const [component] = element;
      const newSamples = ['Delayed Item 1', 'Delayed Item 2', 'Delayed Item 3'];
      component.sampleList = newSamples;

      assertSampleList('#props-test-1', newSamples);
    });
  });

  it('should update based on falsy value', () => {
    cy.shadowGet('#props-test-1')
      .shadowFind('.app')
      .shadowFind('.header-title')
      .shadowContains('Delay Title');

    cy.shadowGet('#props-test-1').then((element) => {
      const [component] = element;
      component.showTitle = false;

      cy.shadowGet('#props-test-1')
        .shadowFind('.app')
        .shadowFind('.header-title')
        .shadowContains('no-title');
    });
  });

  it('should update based on attribute without value', () => {
    cy.shadowGet('#props-test-2')
      .shadowFind('.app')
      .shadowFind('.hidden')
      .shadowContains('SHOW HIDDEN');
  });

  it('should treat attribute value "false" as boolean', () => {
    cy.shadowGet('#props-test-3')
      .shadowFind('.app')
      .shadowFind('.header-title')
      .shadowContains('no-title');
  });

  it('should parse attribute with JSON content', () => {
    assertSampleList('#props-test-4', ['test-1', 'test-2', 'test-3']);
  });
});
