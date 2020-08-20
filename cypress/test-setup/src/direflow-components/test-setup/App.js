import React from 'react';
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
  const hidden = props.showHidden ? 'SHOW HIDDEN' : null;

  return (
    <Styled styles={styles}>
      <div className='app'>
        <div className='header-title'>{title}</div>
        <div>{renderSampleList}</div>
        <div className='slotted-elements'>
          <slot name='slotted-item-1' />
          <slot name='slotted-item-2' />
        </div>
        <div className='hidden'>{hidden}</div>
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

App.defaultProps = {
  componentTitle: 'Test Setup',
  showTitle: true,
  showHidden: false,
  sampleList: ['Item 1', 'Item 2', 'Item 3'],
};

export default App;
