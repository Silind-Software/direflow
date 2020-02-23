describe('Using attributes', () => {
  before(() => {
    cy.visit('/');
  });

  it('should contain a custom element', () => {
    cy.get('props-test').should('exist');
  });

  it('should have default componentTitle', () => {
    cy.shadowGet('props-test')
      .shadowFind('.app .header-title')
      .shadowContains('Props Title');
  });
});

describe('Using properties', () => {
  before(() => {
    cy.visit('/');
  });

  const assertSampleList = (assertions) => {
    cy.shadowGet('props-test')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(0)
      .shadowContains(assertions[0]);

    cy.shadowGet('props-test')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(1)
      .shadowContains(assertions[1]);

    cy.shadowGet('props-test')
      .shadowFind('.app')
      .shadowFind('div')
      .shadowEq(1)
      .shadowFind('.sample-text')
      .shadowEq(2)
      .shadowContains(assertions[2]);
  };

  it('should contain a custom element', () => {
    cy.get('props-test').should('exist');
  });

  it('should update componentTitle', () => {
    cy.shadowGet('props-test').then((element) => {
      const [component] = element;
      component.componentTitle = 'Update Title';

      cy.shadowGet('props-test')
        .shadowFind('.app .header-title')
        .shadowContains('Update Title');
    });
  });

  it('should update componentTitle with delay', () => {
    cy.shadowGet('props-test')
      .shadowFind('.app .header-title')
      .shadowContains('Update Title');

    cy.wait(500);

    cy.shadowGet('props-test').then((element) => {
      const [component] = element;
      component.componentTitle = 'Delay Title';

      cy.shadowGet('props-test')
        .shadowFind('.app .header-title')
        .shadowContains('Delay Title');
    });
  });

  it('should update sampleList items', () => {
    cy.shadowGet('props-test').then((element) => {
      const [component] = element;
      const samples = ['New Item 1', 'New Item 2', 'New Item 3'];
      component.sampleList = samples;

      assertSampleList(samples);
    });
  });

  it('should update sampleList items with delay', () => {
    const currentSamples = ['New Item 1', 'New Item 2', 'New Item 3'];
    assertSampleList(currentSamples);

    cy.wait(500);

    cy.shadowGet('props-test').then((element) => {
      const [component] = element;
      const newSamples = ['Delayed Item 1', 'Delayed Item 2', 'Delayed Item 3'];
      component.sampleList = newSamples;

      assertSampleList(newSamples);
    });
  });

  it('should update based on falsy value', () => {
    cy.shadowGet('props-test')
      .shadowFind('.app .header-title')
      .shadowContains('Delay Title');

    cy.shadowGet('props-test').then((element) => {
      const [component] = element;
      component.showTitle = false;

      cy.shadowGet('props-test')
        .shadowFind('.app .header-title')
        .shadowContains('no-title');
    });
  });
});
