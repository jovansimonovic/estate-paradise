import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInStart: (state) => {
      state.loading = true;
    },
    logInSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    logInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    updateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteStart: (state) => {
      state.loading = true;
    },
    deleteSuccess: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    deleteFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  logInStart,
  logInSuccess,
  logInFailure,
  logout,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
} = userSlice.actions;
export default userSlice.reducer;
