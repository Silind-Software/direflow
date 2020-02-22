import React from 'react';
import PropTypes from 'prop-types';
import { Styled, EventConsumer } from 'direflow-component';
import styles from './App.css';

const App = (props) => {
  const handleClick = (dispatch) => {
    const event = new Event('test-click-event');
    dispatch(event);
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
        <EventConsumer>
          {(dispatch) => (
            <button className='button' onClick={() => handleClick(dispatch)}>
              Click
            </button>
          )}
        </EventConsumer>
        
      </div>
    </Styled>
  );
};

App.propTypes = {
  sampleList: PropTypes.array,
  componentTitle: PropTypes.string,
};

export default App;
