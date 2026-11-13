import { configureStore } from "@reduxjs/toolkit";
import authen from "./Slices/AuthSlice"
import cartReducer from "./Slices/cartSlice"
import uiReducer from "./Slices/uiSlice"
import stroeSlice from "./Slices/StoreSlice"
export const store = configureStore({
  reducer: {
    auth:authen,
    cart:cartReducer,
    ui:uiReducer,
    store:stroeSlice
  }
});