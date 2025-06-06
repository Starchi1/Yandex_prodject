import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

export type TInitialState = {
  isUserLoading: boolean;
  user: TUser | null;
  isAuthorized: boolean;
  userError: string | null;
};

export const initialState: TInitialState = {
  isUserLoading: false,
  user: null,
  isAuthorized: false,
  userError: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  (loginData: TLoginData) => loginUserApi(loginData)
);

export const registerUser = createAsyncThunk(
  'user/register',
  (registerData: TRegisterData) => registerUserApi(registerData)
);

export const logoutUser = createAsyncThunk('user/logout', () => logoutApi());

export const updateUser = createAsyncThunk(
  'user/update',
  (updateData: Partial<TRegisterData>) => updateUserApi(updateData)
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  (recoveryData: { email: string }) => forgotPasswordApi(recoveryData)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  (resetData: { password: string; token: string }) =>
    resetPasswordApi(resetData)
);

export const getUser = createAsyncThunk('user/get', () => getUserApi());

const handlePending = (state: TInitialState) => {
  state.isUserLoading = true;
  state.userError = null;
};

const handleRejected = (state: TInitialState, action: any) => {
  state.isUserLoading = false;
  state.userError = action.error.message;
};

const pendingActions = [
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  forgotPassword,
  resetPassword,
  getUser
];

const rejectedActions = [
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  forgotPassword,
  resetPassword,
  getUser
];

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.userError = null;
    }
  },
  selectors: {
    selectIsUserLoading: (state) => state.isUserLoading,
    selectUser: (state) => state.user,
    selectIsAuthorized: (state) => state.isAuthorized,
    selectUserError: (state) => state.userError
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userError = null;
        state.isAuthorized = true;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userError = null;
        state.isAuthorized = true;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserLoading = false;
        state.userError = null;
        state.isAuthorized = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userError = null;
        state.isAuthorized = true;
        state.user = action.payload.user;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isUserLoading = false;
        state.userError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isUserLoading = false;
        state.userError = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userError = null;
        state.isAuthorized = true;
        state.user = action.payload.user;
      })
      .addMatcher(
        (action) => pendingActions.some((thunk) => thunk.pending.match(action)),
        handlePending
      )
      .addMatcher(
        (action) =>
          rejectedActions.some((thunk) => thunk.rejected.match(action)),
        handleRejected
      );
  }
});

export const {
  selectIsUserLoading,
  selectUser,
  selectIsAuthorized,
  selectUserError
} = userSlice.selectors;

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;
