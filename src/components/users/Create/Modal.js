import React from 'react';
import styled from 'styled-components';

const Outer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #00000040;
  display: flex;
  flex-direction: column;

  & > * {
    margin: auto;
  }
`;

const Inner = styled.div`
  background: var(--color-light);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 16px 0 #00000040;
`;

export default ({ children }) => (
  <Outer>
    <Inner>{children}</Inner>
  </Outer>
);
