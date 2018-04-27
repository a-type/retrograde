import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Title } from 'components/generic';

export default () => (
  <Route
    path="/"
    render={({ match: { isExact } }) => (
      <Link to="/">
        <Title
          style={{
            position: 'fixed',
            top: '5px',
            left: '5px',
            fontSize: isExact ? '5vmax' : '1vmax',
          }}
        >
          Retrograde
        </Title>
      </Link>
    )}
  />
);
