import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios/api";

// Get Cart API
export const getCart = createAsyncThunk(
    "cart/getCart",
    async () => {
        const response = await api.get("/cart/get");
        return response.data;
    }
);

// Update Quantity API
export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ id, quantity }) => {
        const response = await api.put(`/cart/update/${id}`, {
            quantity: quantity
        });

        return response.data;
    }
);
export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (id) => {
        const response = await api.delete(`/cart/remove/${id}`);
        return response.data;
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