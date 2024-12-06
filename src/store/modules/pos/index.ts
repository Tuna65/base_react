import { ILocation } from "@/models/location";
import { Tab } from "@/types/pos";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TabPos = {
  tabs: Tab[];
  location?: ILocation;
};

export const defaultTab = { id: 1, isActive: true, lineItems: [], discount: 0, refund: 0 };

const initialState: TabPos = {
  tabs: [defaultTab],
  location: undefined,
};

const { actions, reducer: posReducer } = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setTabs(state, action: PayloadAction<Tab[]>) {
      state.tabs = action.payload;
    },

    setLocation(state, action: PayloadAction<ILocation>) {
      state.location = action.payload;
    },

    clear() {
      return { ...initialState };
    },
  },
});
const posActions = { ...actions };

export { posActions, posReducer };
