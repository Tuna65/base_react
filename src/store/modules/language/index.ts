import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18next from 'i18next';

export type language = {
  type: 'vi' | 'en';
};

const initialState = {
  type: 'vi',
};

const { actions, reducer: languageReducer } = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<'vi' | 'en'>) {
      state.type = action.payload;
      // document.cookie = `${}=${JSON.stringify(action.payload ?? 'vi')}`;
      localStorage.setItem('SAFFIA_LANGUAGE_KEY', action.payload ?? 'vi');
      i18next.changeLanguage(action.payload);
    },
    clear() {
      return { ...initialState };
    },
  },
});
const languageActions = {
  ...actions,
};

export { languageActions, languageReducer };
export default language;
