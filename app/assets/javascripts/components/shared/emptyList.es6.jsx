import React from 'react';
import { grey500 } from 'material-ui/styles/colors';

const EmptyList = () => {
  const emptyListStyle = {
    paddingTop: '60px',
    paddingBottom: '60px',
  };

  return (
    <div className="no_content text-center" style={emptyListStyle}>
      <h1 style={{ color: grey500 }}>No developers found</h1>
    </div>
  );
};

export default EmptyList;
