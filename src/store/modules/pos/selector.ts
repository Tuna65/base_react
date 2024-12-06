import { RootState } from "../../root-reducer";

export const tabsSelector = (rootState: RootState) => rootState.pos.tabs;
export const locationSelector = (rootState: RootState) => rootState.pos.location;
