
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStore: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,

  reducers: {
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },

    clearSelectedStore: (state) => {
      state.selectedStore = null;
    },
  },
});

export const { setSelectedStore, clearSelectedStore } =
  storeSlice.actions;

export default storeSlice.reducer;
