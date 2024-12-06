import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  open: boolean;
};

const initialState: State = {
  open: false,
};

const { actions, reducer: sidebarReducer } = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
    clear() {
      return { ...initialState, isInit: true };
    },
  },
});

const sidebarActions = { ...actions };

export { sidebarActions, sidebarReducer };

