import styled from 'styled-components';

export default styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-areas: 'logo users' 'title users' 'columns users';
  grid-template-columns: 1fr auto;
  grid-template-rows: 1vmax auto 1fr;

  & > *:nth-child(1) {
    grid-area: title;
    margin-left: 0;
    padding: 20px;
  }
  & > *:nth-child(2) {
    grid-area: columns;
    overflow-y: auto;
    padding: 20px;
  }
  & > *:nth-child(3) {
    grid-area: users;
    overflow-y: auto;
    padding: 20px;
  }
`;
