import React from 'react';

import './styles.css';

export const Title = ({ children, name }) => {
  return (
    <div className='title'>
      { children }
      <span>{name}</span>
    </div>
  );
}
