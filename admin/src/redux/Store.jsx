import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";

export const Store = configureStore({
  reducer: {
    auth: authReducer
  }
});
