import { CircularProgress } from '@material-ui/core';
import React from 'react';

const Loader = () => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loader;
