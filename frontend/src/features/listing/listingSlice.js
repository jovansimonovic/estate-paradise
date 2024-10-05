import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listing: null,
  error: null,
  loading: false,
};

export const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    createStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    createSuccess: (state) => {
      state.error = null;
      state.loading = false;
    },
    createFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { createStart, createSuccess, createFailure } =
  listingSlice.actions;
export default listingSlice.reducer;
