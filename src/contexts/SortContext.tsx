import React, { createContext, useState } from 'react';

export enum SortMode {
  Category = 'category',
  Tags = 'tags',
  Free = 'free',
}
type SortContext = {
  mode: SortMode;
  setMode(mode: SortMode): void;
};

const SortContext = createContext<SortContext>({
  mode: SortMode.Category,
  setMode: () => {},
});
const { Provider: BaseProvider, Consumer } = SortContext;

const Provider = ({ children, ...props }) => {
  const [mode, setMode] = useState(SortMode.Category);

  return (
    <BaseProvider value={{ mode, setMode }} {...props}>
      {children}
    </BaseProvider>
  );
};

export { Provider, Consumer };
export default SortContext;
