

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/checkauth",
        {
          withCredentials: true,
        }
      );
 console.log("response.data.user",response.data.user)
      return response.data.user;
    } catch (error) {
        console.log("error at redux",error.response.data.message)
      return Promise.reject(error.message);
    }
  }
);

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setuser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })

      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.error.message;
      });
  },
});

export const { setuser, logout } = authSlice.actions;

export default authSlice.reducer;
