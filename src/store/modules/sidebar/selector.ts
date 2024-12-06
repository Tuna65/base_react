import { RootState } from "../../root-reducer";
export const sidebarSelector = (rootState: RootState) => rootState.sidebar.open;
