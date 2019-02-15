import React, { SFC, Suspense, useContext, ReactNode } from 'react';
import Cards from './Cards';
import { Box } from 'grommet';
import SortContext, { SortMode } from '@/contexts/SortContext';

interface BoardProps {}

const Board: SFC<BoardProps> = ({}) => {
  const { mode } = useContext(SortContext);

  let content: ReactNode = null;

  switch (mode) {
    case SortMode.Category:
      content = <Cards />;
    default:
      content = <Cards />; // TODO
  }

  return (
    <Box pad="large" width="100%">
      <Suspense fallback={<div>Loading...</div>}>{content}</Suspense>
    </Box>
  );
};

export default Board;
