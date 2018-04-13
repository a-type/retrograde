import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;

  & > * {
    flex: 0 1 25%;
  }
`;
