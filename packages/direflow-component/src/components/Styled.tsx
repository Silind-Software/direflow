import React, { FC, Component, ReactNode, ComponentClass, CSSProperties } from 'react';
import Style from 'style-it';

interface IStyled {
  styles: CSSProperties;
  children: ReactNode | ReactNode[];
}

const Styled: FC<IStyled> = (props): JSX.Element => {
  const styles = props.styles.toString();
  return Style.it(styles, props.children);
};

const withStyles = (styles: CSSProperties) => <P, S>(WrappedComponent: ComponentClass<P, S> | FC<P>) => {
  return class extends Component<P, S> {
    public render(): JSX.Element {
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
