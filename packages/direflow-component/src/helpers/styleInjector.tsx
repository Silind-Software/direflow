import React, { Component, cloneElement, isValidElement } from 'react';
import adler32 from 'react-lib-adler32';

const isDevEnv = process.env.NODE_ENV !== 'production';

interface IProps {
  scoped?: boolean;
}

class Style extends Component<IProps> {
  private scopeClassNameCache: { [key: string]: string } = {};
  private scopedCSSTextCache: { [key: string]: string } = {};
  private scoped = this.props.scoped !== undefined ? this.props.scoped : true;
  private pepper = '';

  getStyleString = () => {
    if (this.props.children instanceof Array) {
      const styleString = this.props.children.filter(
        (child) => !isValidElement(child) && typeof child === 'string',
      );

      if (styleString.length > 1) {
        throw new Error(`Multiple style objects as direct descedents of a
        Style component are not supported (${styleString.length} style objects detected):

        ${styleString[0]}
        `);
      }

      return styleString[0];
    }

    if (typeof this.props.children === 'string' && !isValidElement(this.props.children)) {
      return this.props.children;
    }

    return null;
  };

  getRootElement = () => {
    if (this.props.children instanceof Array) {
      const rootElement = this.props.children.filter((child) => isValidElement(child));

      if (isDevEnv) {
        if (rootElement.length > 1) {
          console.log(rootElement);
          throw new Error(`Adjacent JSX elements must be wrapped in an enclosing tag 
          (${rootElement.length} root elements detected)`);
        }

        if (
          typeof rootElement[0] !== 'undefined' &&
          this.isVoidElement((rootElement[0] as any).type)
        ) {
          throw new Error(`Self-closing void elements like ${(rootElement as any).type} must be 
          wrapped in an enclosing tag. Reactive Style must be able to nest a style element inside of the 
          root element and void element content models never 
          allow it to have contents under any circumstances.`);
        }
      }

      return rootElement[0];
    }

    if (isValidElement(this.props.children)) {
      return this.props.children;
    }

    return null;
  };

  getRootSelectors = (rootElement: any) => {
    const rootSelectors = [];

    if (rootElement.props.id) {
      rootSelectors.push(`#${rootElement.props.id}`);
    }

    if (rootElement.props.className) {
      rootElement.props.className
        .trim()
        .split(/\s+/g)
        .forEach((className: string) => rootSelectors.push(className));
    }

    if (!rootSelectors.length && typeof rootElement.type !== 'function') {
      rootSelectors.push(rootElement.type);
    }

    return rootSelectors;
  };

  processCSSText = (styleString: any, scopeClassName?: string, rootSelectors?: any[]) => {
    return styleString
      .replace(/\s*\/\/(?![^(]*\)).*|\s*\/\*.*\*\//g, '')
      .replace(/\s\s+/g, ' ')
      .split('}')
      .map((fragment: any) => {
        const isDeclarationBodyPattern = /.*:.*;/g;
        const isLastItemDeclarationBodyPattern = /.*:.*(;|$|\s+)/g;
        const isAtRulePattern = /\s*@/g;
        const isKeyframeOffsetPattern = /\s*(([0-9][0-9]?|100)\s*%)|\s*(to|from)\s*$/g;

        return fragment
          .split('{')
          .map((statement: any, i: number, arr: any[]) => {
            if (!statement.trim().length) {
              return '';
            }

            const isDeclarationBodyItemWithOptionalSemicolon =
              arr.length - 1 === i && statement.match(isLastItemDeclarationBodyPattern);
            if (
              statement.match(isDeclarationBodyPattern) ||
              isDeclarationBodyItemWithOptionalSemicolon
            ) {
              return this.escapeTextContentForBrowser(statement);
            }

            const selector = statement;

            if (scopeClassName && !/:target/gi.test(selector)) {
              if (!selector.match(isAtRulePattern) && !selector.match(isKeyframeOffsetPattern)) {
                return this.scopeSelector(scopeClassName, selector, rootSelectors);
              }

              return selector;
            }

            return selector;
          })
          .join('{\n');
      })
      .join('}\n');
  };

  escaper = (match: any) => {
    const ESCAPE_LOOKUP: { [key: string]: string } = {
      '>': '&gt;',
      '<': '&lt;',
    };

    return ESCAPE_LOOKUP[match];
  };

  escapeTextContentForBrowser = (text: string) => {
    const ESCAPE_REGEX = /[><]/g;
    return `${text}`.replace(ESCAPE_REGEX, this.escaper);
  };

  scopeSelector = (scopeClassName: string, selector: string, rootSelectors?: any[]) => {
    const scopedSelector: string[] = [];

    const groupOfSelectorsPattern = /,(?![^(|[]*\)|\])/g;

    const selectors = selector.split(groupOfSelectorsPattern);

    selectors.forEach((selectorElement) => {
      let containsSelector;
      let unionSelector;

      if (
        rootSelectors?.length &&
        rootSelectors.some((rootSelector) => selectorElement.match(rootSelector))
      ) {
        unionSelector = selectorElement;

        const escapedRootSelectors = rootSelectors?.map((rootSelector) =>
          rootSelector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
        );

        unionSelector = unionSelector.replace(
          new RegExp(`(${escapedRootSelectors?.join('|')})`),
          `$1${scopeClassName}`,
        );

        containsSelector = this.scoped ? `${scopeClassName} ${selectorElement}` : selectorElement;
        scopedSelector.push(unionSelector, containsSelector);
      } else {
        containsSelector = this.scoped ? `${scopeClassName} ${selectorElement}` : selectorElement;
        scopedSelector.push(containsSelector);
      }
    });

    if (!this.scoped && scopedSelector.length > 1) {
      return scopedSelector[1];
    }

    return scopedSelector.join(', ');
  };

  getScopeClassName = (styleString: any, rootElement: any) => {
    let hash = styleString;

    if (rootElement) {
      this.pepper = '';
      this.traverseObjectToGeneratePepper(rootElement);
      hash += this.pepper;
    }

    return (isDevEnv ? 'scope-' : 's') + adler32(hash);
  };

  traverseObjectToGeneratePepper = (obj: any, depth = 0) => {
    if (depth > 32 || this.pepper.length > 10000) return;

    Object.keys(obj).forEach((prop) => {
      const isPropReactInternal = /^[_$]|type|ref|^value$/.test(prop);

      if (!!obj[prop] && typeof obj[prop] === 'object' && !isPropReactInternal) {
        this.traverseObjectToGeneratePepper(obj[prop], depth + 1);
      } else if (!!obj[prop] && !isPropReactInternal && typeof obj[prop] !== 'function') {
        this.pepper += obj[prop];
      }
    });
  };

  isVoidElement = (type: string) =>
    [
      'area',
      'base',
      'br',
      'col',
      'command',
      'embed',
      'hr',
      'img',
      'input',
      'keygen',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ].some((voidType) => type === voidType);

  createStyleElement = (cssText: string, scopeClassName: string) => {
    return (
      <style
        id='direflow_styles'
        type='text/css'
        key={scopeClassName}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: cssText || '' }}
      />
    );
  };

  getNewChildrenForCloneElement = (
    cssText: string,
    rootElement: JSX.Element,
    scopeClassName: string,
  ) => {
    return [this.createStyleElement(cssText, scopeClassName)].concat(rootElement.props.children);
  };

  render() {
    const styleString = this.getStyleString();
    const rootElement: any = this.getRootElement();

    if (!styleString && rootElement) {
      return rootElement.props.children;
    }

    if (styleString && !rootElement) {
      return this.createStyleElement(
        this.processCSSText(styleString),
        this.getScopeClassName(styleString, rootElement),
      );
    }

    const rootElementId = rootElement.props.id ? rootElement.props.id : '';
    const rootElementClassNames = rootElement.props.className
      ? `${rootElement.props.className} `
      : '';

    let scopeClassName;
    let scopedCSSText;
    const scopeClassNameAddress = rootElementClassNames + rootElementId + styleString;

    if (this.scopeClassNameCache[scopeClassNameAddress]) {
      scopeClassName = this.scopeClassNameCache[scopeClassNameAddress];
      scopedCSSText = this.scopedCSSTextCache[scopeClassName];
    } else {
      scopeClassName = this.getScopeClassName(styleString, rootElement);
      scopedCSSText = this.processCSSText(
        styleString,
        `.${scopeClassName}`,
        this.getRootSelectors(rootElement),
      );

      this.scopeClassNameCache[scopeClassNameAddress] = scopeClassName;
      this.scopedCSSTextCache[scopeClassName] = scopedCSSText;
    }

    const className = this.scoped
      ? `${rootElementClassNames}${scopeClassName}`
      : rootElementClassNames;

    return cloneElement(
      rootElement,
      {
        ...rootElement.props,
        className: className.trim(),
      },
      this.getNewChildrenForCloneElement(scopedCSSText, rootElement, scopeClassName),
    );
  }
}

export default Style;
