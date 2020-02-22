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

  const title = props.showTitle ? props.componentTitle : 'no-title';

  return (
    <Styled styles={styles}>
      <div className='app'>
        <div className='header-title'>{title}</div>
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
