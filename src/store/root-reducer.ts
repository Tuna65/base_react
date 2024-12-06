import { combineReducers } from "redux";
import { languageReducer } from "./modules/language";
import { authReducer } from "./modules/auth";
import { sidebarReducer } from "./modules/sidebar";
import { keyReducer } from "./modules/tanstackKey";
import { posReducer } from "./modules/pos";

const rootReducer = combineReducers({
  language: languageReducer,
  auth: authReducer,
  sidebar: sidebarReducer,
  key: keyReducer,
  pos: posReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
