import React from 'react';
import PropTypes from 'prop-types';
import { Styled } from 'direflow-component';
import styles from './App.css';

const App = (props) => {
  const handleClick = () => {
    const event = new Event('my-event');
  };

  const renderSampleList = props.sampleList.map((sample) => (
    <div key={sample} className='sample-text'>
      {sample}
    </div>
  ));

  return (
    <Styled styles={styles}>
      <div className='app'>
        <div className='header-title'>{props.componentTitle}</div>
        <div>{renderSampleList}</div>
        <button className='button' onClick={handleClick}>
          Click
        </button>
      </div>
    </Styled>
  );
};

App.propTypes = {
  sampleList: PropTypes.array,
  componentTitle: PropTypes.string,
};

export default App;
