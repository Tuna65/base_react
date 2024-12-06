import { RootState } from "../../root-reducer";
export const titleSelector = (rootState: RootState) => rootState.auth.title;
export const userSelector = (rootState: RootState) => rootState.auth.user;
