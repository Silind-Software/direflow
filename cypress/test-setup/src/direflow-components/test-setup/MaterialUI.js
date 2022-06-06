import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomizedButton = styled(Button)`
  color: #20b2aa;

  :hover {
    color: #2e8b57;
  }
`;

const MaterialUI = () => {
  return (
    <CustomizedButton id='material-ui-button' variant='contained'>
      My Material UI Button
    </CustomizedButton>
  );
};

export default MaterialUI;
