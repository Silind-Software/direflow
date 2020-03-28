import React, { FC, Component, ReactNode, ComponentClass, CSSProperties } from 'react';
import Style from '../helpers/styleInjector';

type TStyles = string | string[] | CSSProperties | CSSProperties[];

interface IStyled {
  styles: TStyles;
  scoped?: boolean;
  children: ReactNode | ReactNode[];
}

const Styled: FC<IStyled> = (props): JSX.Element => {
  let styles;

  if (typeof props.styles === 'string') {
    styles = (props.styles as CSSProperties).toString();
  } else {
    styles = (props.styles as CSSProperties[]).reduce(
      (acc: CSSProperties, current: CSSProperties) => `${acc} ${current}` as CSSProperties,
    );
  }

  return (
    <Style scoped={props.scoped}>
      {styles}
      {props.children}
    </Style>
  );
};

const withStyles = (styles: TStyles) => <P, S>(WrappedComponent: ComponentClass<P, S> | FC<P>) => {
  // eslint-disable-next-line react/prefer-stateless-function
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
