// eslint-disable-next-line no-undef
jest.mock('../direflow-component', () => ({
  Styled: (props) => {
    return props.children;
  },
  EventContext: {},
}));
