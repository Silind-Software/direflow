import { stripCommentsAndSelectors, addVariableFallbacks } from '../packages/direflow-component/src/utils/cssFormatter';

describe('Strip comments in css', () => {
  it('should strip comments in css', () => {
    const css = `
      /*
      * This is a comment in a css-file.
      * This should get stripped.
      */

      body {
        width: 100%:
      }

      .some-element {
        background-color: red;
      }
    `;

    const result = `
      /*
      * -
      */

      body {
        width: 100%:
      }

      .some-element {
        background-color: red;
      }
    `;

    const strippedCss = stripCommentsAndSelectors(css);

    expect(strippedCss.replace(/\s/g, '')).toBe(result.replace(/\s/g, ''));
  });
});

describe('Add variable fallback in css', () => {
  it('should remove root selector', () => {
    const css = `
      :root {
        --color-absolute-white: #fff;
        --color-absolute-black: #000;
      }
    `;

    const withoutRoot = addVariableFallbacks(css);

    const result = `
      {
        --color-absolute-white: #fff;
        --color-absolute-black: #000;
      }
    `;

    expect(withoutRoot.replace(/\s/g, '')).toBe(result.replace(/\s/g, ''));
  });

  it('should replace css variable with final value', () => {
    const css = `
      :root {
        --color-absolute-white: #fff;
        --color-absolute-black: #000;
      }

      body {
        color: var(--color-absolute-white);
      }

      .some-element {
        background-color: var(--color-absolute-black);
      }
    `;

    const withFallbacks = addVariableFallbacks(css);

    const result = `
      {
        --color-absolute-white: #fff;
        --color-absolute-black: #000;
      }

      body {
        color: #fff;
        color: var(--color-absolute-white);
      }

      .some-element {
        background-color: #000;
        background-color: var(--color-absolute-black);
      }
    `;

    expect(withFallbacks.replace(/\s/g, '')).toBe(result.replace(/\s/g, ''));
  });
});
