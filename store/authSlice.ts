import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../types";

export interface AuthState {
  token: string | null;
  userData: UserData | null;
  didTryAutoLogin: boolean;
}

const initialState: AuthState = {
  token: null,
  userData: null,
  didTryAutoLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (
      state,
      action: PayloadAction<{
        token: string;
        userData: UserData;
      }>
    ) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.didTryAutoLogin = true;
    },
    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },
    logout: (state) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },
  },
});
export const { setDidTryAutoLogin, authenticate, logout } = authSlice.actions;
export default authSlice.reducer;
