// Libraries
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
// Utils
import { isFunc } from './utils';

// StyledButton

const StyledButton = styled.button({
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '5px',
  color: 'red',
  cursor: 'pointer',
  fontSize: '30px',

  '&:hover': {
    backgroundColor: '#E9E9E9',
  },
});

// NumberInputs

export default function NumberInputs({
  onChange,
  onXClick,
  placeholder,
  style,
  ...props
}) {
  // State

  const [isValidFormat, setIsValidFormat] = useState(true);
  const [value, setValue] = useState('');

  // Functions

  function handleKeyUp(e) {
    const keys = {
      Escape: () => setValue(''),
    };

    return keys[e.key] && keys[e.key]();
  }

  function handleOnChange(e) {
    const _isValidFormat = !isNaN(e.target.value);

    isFunc(onChange) && onChange(e, { isValidFormat: _isValidFormat });

    setIsValidFormat(_isValidFormat);

    setValue(e.target.value);

    // noop
    return undefined;
  }

  function handleXClick(e) {
    isFunc(onXClick) && onXClick(e);

    // noop
    return undefined;
  }

  // Return

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', ...style }}
      {...props}
    >
      <p style={{ color: 'red', height: '19px', margin: 0 }}>
        {isValidFormat ? '' : 'Must be a number'}
      </p>

      <div style={{ display: 'flex' }}>
        <input
          onChange={handleOnChange}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
          style={{
            outlineColor: isValidFormat ? 'black' : 'red',
            borderRadius: '5px',
            fontSize: '20px',
            marginRight: '10px',
            padding: '10px',
          }}
          value={value}
        />

        <StyledButton onClick={handleXClick}>X</StyledButton>
      </div>
    </div>
  );
}

NumberInputs.propTypes = {
  onChange: PropTypes.func,
  onXClick: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};
