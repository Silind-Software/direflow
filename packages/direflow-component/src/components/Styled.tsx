import React, { FC, Component, ReactNode, ComponentClass, CSSProperties } from 'react';
import Style from 'style-it';

interface IStyled {
  styles: string | CSSProperties | CSSProperties[];
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

  return Style.it(styles, props.children);
};

const withStyles = (styles: string | CSSProperties | CSSProperties[]) => <P, S>(
  WrappedComponent: ComponentClass<P, S> | FC<P>,
) => {
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
