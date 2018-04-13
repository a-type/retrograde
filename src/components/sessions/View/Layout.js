import styled from 'styled-components';

export default styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-areas: 'title users' 'columns users';
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;

  & > *:nth-child(1) {
    grid-area: title;
  }
  & > *:nth-child(2) {
    grid-area: columns;
    overflow-y: auto;
  }
  & > *:nth-child(3) {
    grid-area: users;
    overflow-y: auto;
  }
`;
