import { RootState } from '../../root-reducer';

export const languageSelector = (rootState: RootState) => rootState.language.type;
