// Libraries
import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { toWordsOrdinal } from 'number-to-words';
import { v4 as uuid } from 'uuid';
// Copmponents
import NumberInputs from './NumberInputs';
// Utils
import { capitalizeFirstLetter } from './utils';

// Helper Functions

function buildPlaceholder(num) {
  return `${capitalizeFirstLetter(toWordsOrdinal(num))} Number`;
}

// Constants

const ACTION_TYPES = Object.freeze({
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  UPDATE: 'UPDATE',
});

const APP_STATES = Object.freeze({
  NOT_READY: 'NOT_READY',
  READY: 'READY',
});

// Reducer

const initialState = {
  [uuid()]: {
    isValidFormat: false,
    value: '',
  },
  [uuid()]: {
    isValidFormat: false,
    value: '',
  },
};

function reducer(state, { payload = {}, type }) {
  const { key } = payload;

  switch (type) {
    case ACTION_TYPES.ADD:
      return {
        ...state,
        [uuid()]: {
          isValidFormat: false,
          value: '',
        },
      };

    case ACTION_TYPES.REMOVE:
      const { [key]: toBeDeleted, ...restState } = state;
      return restState;

    case ACTION_TYPES.UPDATE:
      const { isValidFormat, newVal } = payload;

      return {
        ...state,
        [key]: { isValidFormat, value: newVal },
      };

    default:
      return state;
  }
}

// App

export default function App() {
  // State

  const [appState, setAppState] = useState(APP_STATES.NOT_READY);
  const [answer, setAnswer] = useState(null);

  // Reducer

  const [numberState, dispatch] = useReducer(reducer, initialState);

  // Effects

  useEffect(() => {
    const newState =
      Object.values(numberState).filter(numInput => !numInput.isValidFormat)
        .length === 0
        ? APP_STATES.READY
        : APP_STATES.NOT_READY;
    setAppState(newState);
  }, [numberState]);

  // Functions

  async function handleAddNumbersClick() {
    const { data } = await axios.post('http://localhost:3001/addNumbers', {
      numbers: Object.values(numberState).map(numInput => numInput.value),
    });

    setAnswer(data);

    // noop
    return undefined;
  }

  function handleAddAnotherNumberClick() {
    dispatch({ type: ACTION_TYPES.ADD });

    setAnswer(null);

    // noop
    return undefined;
  }

  function handleOnChange({ isValidFormat, key, uiEvent }) {
    dispatch({
      payload: { key, isValidFormat, newVal: uiEvent.target.value },
      type: ACTION_TYPES.UPDATE,
    });

    setAnswer(null);

    // noop
    return undefined;
  }

  function handleXClick({ key }) {
    dispatch({ payload: { key }, type: ACTION_TYPES.REMOVE });

    setAnswer(null);

    // noop
    return undefined;
  }

  // Components

  const numberInputs = Object.entries(numberState).map(([key, val], i) => (
    <NumberInputs
      key={key}
      onXClick={() => handleXClick({ key })}
      onChange={(e, { isValidFormat }) =>
        handleOnChange({ isValidFormat, key, uiEvent: e })
      }
      placeholder={buildPlaceholder(i + 1)}
      style={{ marginBottom: '10px' }}
    />
  ));

  // Return

  return (
    <div style={{ margin: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Add Numbers</h1>

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '250px' }}
        >
          {numberInputs}

          <button
            onClick={handleAddAnotherNumberClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'blue',
              cursor: 'pointer',
              fontSize: '12px',
              textAlign: 'left',
            }}
          >
            + Add another number
          </button>

          <button
            disabled={appState === APP_STATES.NOT_READY}
            onClick={handleAddNumbersClick}
            style={{
              borderRadius: '5px',
              cursor:
                appState === APP_STATES.NOT_READY ? 'not-allowed' : 'pointer',
              fontSize: '20px',
              marginTop: '30px',
              padding: '10px',
            }}
          >
            Add Numbers
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '25px' }}>Your number</p>
          <p style={{ fontSize: '25px' }}>{answer}</p>
        </div>
      </div>
    </div>
  );
}
