import React from 'react';
import styled from 'styled-components';

const RedButton = styled.div`
  width: 100px;
  height: 50px;
  background-color: red;
`;

const StyledComponent = () => {
  return <RedButton id='styled-component-button'>Styled Component Button</RedButton>;
};

export default StyledComponent;
