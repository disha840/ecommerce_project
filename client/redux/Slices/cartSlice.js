
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios/api";


// Get Cart API
export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { getState, rejectWithValue }) => {

        const user = getState().auth.user;
        const store = getState().store.selectedStore;

        if (!user) {
            return rejectWithValue("Please login first");
        }

        if (!store?._id) {
            return rejectWithValue("Please select a store");
        }

        try {
            const response = await api.get(`/cart/get/${store._id}`);

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Unable to get cart"
            );
        }
    }
);

// Update Quantity API
export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ id, quantity }, { getState, rejectWithValue }) => {

        const user = getState().auth.user;
        const store = getState().store.selectedStore;

        if (!user) {
            return rejectWithValue("Please login first");
        }

        if (!store?._id) {
            return rejectWithValue("Please select a store");
        }

        try {
            const response = await api.put(`/cart/update/${id}`, {
                quantity: quantity,
                storeId: store._id
            });

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Unable to update cart"
            );
        }
    }
);

// Remove Cart Item API
export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (id, { getState, rejectWithValue }) => {

        const user = getState().auth.user;
        const store = getState().store.selectedStore;

        if (!user) {
            return rejectWithValue("Please login first");
        }

        if (!store?._id) {
            return rejectWithValue("Please select a store");
        }

        try {
            const response = await api.delete(`/cart/remove/${id}`, {
                data: {
                    storeId: store._id
                }
            });

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Unable to remove cart item"
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cart: null,
        items: [],
        loading: false,
        updating: false
    },

    reducers: {
        clearCart: (state) => {
            state.cart = null;
            state.items = [];
        }
    },

    extraReducers: (builder) => {

        // Get Cart Cases
        builder.addCase(getCart.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload.cart;
            state.items = action.payload.items;
        });

        builder.addCase(getCart.rejected, (state) => {
            state.loading = false;
            state.cart = null;
            state.items = [];
        });

        // Update Quantity Cases
        builder.addCase(updateCartQuantity.pending, (state) => {
            state.updating = true;
        });

        builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
            state.updating = false;
            state.cart = action.payload.cart;
            state.items = action.payload.items;
        });

        builder.addCase(updateCartQuantity.rejected, (state) => {
            state.updating = false;
        });

        // Remove Cart Item Cases
        builder.addCase(removeCartItem.pending, (state) => {
            state.updating = true;
        });

        builder.addCase(removeCartItem.fulfilled, (state, action) => {
            state.updating = false;
            state.cart = action.payload.cart;
            state.items = action.payload.items;
        });

        builder.addCase(removeCartItem.rejected, (state) => {
            state.updating = false;
        });
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
