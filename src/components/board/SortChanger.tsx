import React, { SFC, useContext } from 'react';
import SortContext, { SortMode } from '@/contexts/SortContext';
import { Select } from 'grommet';

interface SortChangerProps {}

const SortChanger: SFC<SortChangerProps> = ({}) => {
  const { mode, setMode } = useContext(SortContext);

  return (
    <Select
      options={[SortMode.Category, SortMode.Tags, SortMode.Free]}
      value={mode}
      onChange={ev => {
        setMode(ev.value as SortMode);
      }}
    />
  );
};

export default SortChanger;
