import { useState } from 'react';

export const useBoolean = (initialState?: boolean | (() => boolean)) => {
  const [value, setValue] = useState<boolean>(initialState ?? false);

  const on = () => setValue(true);
  const off = () => setValue(false);
  const toggle = () => setValue((prev) => !prev);
  const tools = {
    on: on,
    off: off,
    toggle: toggle,
  };
  const result: [typeof value, typeof tools] = [value, { on, off, toggle }];
  return result;
};
