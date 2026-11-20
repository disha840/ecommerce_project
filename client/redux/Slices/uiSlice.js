import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",

    initialState: {
        showLogin: false,
        showSignup: false
    },

    reducers: {

        setShowLogin: (state, action) => {
            state.showLogin = action.payload;
            state.showSignup = false;
        },

        setShowSignup: (state, action) => {
            state.showSignup = action.payload;
            state.showLogin = false;
        }

    }
});

export const { setShowLogin, setShowSignup } = uiSlice.actions;

export default uiSlice.reducer;