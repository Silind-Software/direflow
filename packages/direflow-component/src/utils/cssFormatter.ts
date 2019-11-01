/**
 * Strips away warning comment at the top
 * @param styles styles to strip comments from
 */
export const stripCommentsAndSelectors = (styles: string): string => {
  const placeholderComment = `
    /*
    * -
    */
  `;

  const stylesWithoutComments = styles.replace(
    /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/gm,
    placeholderComment,
  );

  return stylesWithoutComments;
};

/**
 * Adds css variable fallback for legacy browsers
 * @param styles styles to add fallback to
 */
export const addVariableFallbacks = (styles: string): string => {
  const stylesWithoutRootSelector = styles.replace(/:root/g, '');
  const variableMap = new Map();
  const originalCssLines = stylesWithoutRootSelector.split('\n');
  const newCssLines: string[] = [];

  originalCssLines.forEach((cssLine: string) => {
    if (cssLine.trim().substring(0, 2) === '--') {
      const keyValueSplit = cssLine.trim().split(':');
      variableMap.set(keyValueSplit[0], keyValueSplit[1].replace(';', ''));
    }
  });

  originalCssLines.forEach((cssLine: string) => {
    if (cssLine.includes('var')) {
      const lineWithoutSemiColon = cssLine.replace(';', '');
      const varName = lineWithoutSemiColon.substring(
        lineWithoutSemiColon.indexOf('var(') + 4,
        lineWithoutSemiColon.length - 1,
      );

      const varValue = variableMap.get(varName);
      const lineWithValue = `${lineWithoutSemiColon.replace(`var(${varName})`, varValue)};`;

      newCssLines.push(lineWithValue);
    }

    newCssLines.push(cssLine);
  });

  return newCssLines.join('\n');
};