import { IUser } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  user?: IUser;
  title?: string;
};

const initialState: AuthState = {
  title: "",
};

const { actions, reducer: authReducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    transferTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },

    clear() {
      return { ...initialState, isInit: true };
    },
  },
});

const authActions = { ...actions };

export { authReducer, authActions };
