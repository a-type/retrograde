import styled from 'styled-components';

export default styled.div`
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  border-left: 2px solid var(--color-light);

  & > * {
    margin-bottom: 10px;
  }
`;
