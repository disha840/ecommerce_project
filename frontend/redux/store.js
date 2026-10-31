import { configureStore } from "@reduxjs/toolkit";
import authen from "./Slices/AuthSlice"
export const store = configureStore({
  reducer: {
    auth:authen
    
  }
});