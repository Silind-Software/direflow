const { createContext } = require('react');

// eslint-disable-next-line no-undef
jest.doMock('../direflow-component', () => ({
  Styled: (props) => {
    return props.children;
  },
  EventContext: createContext(() => {}),
}));
