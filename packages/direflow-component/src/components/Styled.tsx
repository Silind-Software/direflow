import React, { FC, Component, ReactNode, ComponentClass, CSSProperties } from 'react';
import Style from 'style-it';
import { stripCommentsAndSelectors, addVariableFallbacks } from '../utils/cssFormatter';

interface IStyled {
  styles: CSSProperties;
  children: ReactNode | ReactNode[];
}

/**
 * Wrapper component for exposing styles
 * @param props React props - contains styles to be injected
 */
const Styled: FC<IStyled> = (props): JSX.Element => {
  const styles = props.styles.toString();
  const formattedStyles = stripCommentsAndSelectors(styles);
  const withFallbacks = addVariableFallbacks(formattedStyles);

  return Style.it(withFallbacks, props.children);
};

/**
 * HOC for exposing styles
 * Can be used instead of <Styled> wrapper component
 * @param styles styles to be injected
 */
const withStyles = (styles: CSSProperties) => <P, S>(WrappedComponent: ComponentClass<P, S> | FC<P>) => {
  return class extends Component<P, S> {
    public render() {
      return (
        <Styled styles={styles}>
          <div>
            <WrappedComponent {...(this.props as P)} />
          </div>
        </Styled>
      );
    }
  };
};

export { withStyles, Styled };
