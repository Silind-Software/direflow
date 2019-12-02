import React, { useContext } from 'react';
import { EventContext, Styled } from 'direflow-component';
import { propTypes } from './properties';
import styles from './App.css';

const App = (props) => {
  const dispatch = useContext(EventContext);

  const handleClick = () => {
    const event = new Event('my-event');
    dispatch(event);
  };

  const renderSampleList = props.sampleList.map((sample) => (
    <div key={sample} className='sample-text'>
      → {sample}
    </div>
  ));

  return (
    <Styled styles={styles}>
      <div className='app'>
        <div className='header'>
          <div className='header-image' />
          <div className='header-title'>{props.componentTitle}</div>
        </div>
        <div className='sample-container'>
          {renderSampleList}
        </div>
        <button className='button' onClick={handleClick}>
          Go go!
        </button>
      </div>
    </Styled>
  );
};

App.propTypes = propTypes;

export default App;
