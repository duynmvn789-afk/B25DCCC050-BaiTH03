import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { CartItem, Product } from "../../types";

const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      return state.filter((item) => item.id !== action.payload);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const item = state.find((entry) => entry.id === action.payload.id);
      if (!item) {
        return;
      }
      if (action.payload.quantity <= 0) {
        return state.filter((entry) => entry.id !== action.payload.id);
      }
      item.quantity = action.payload.quantity;
    },
    clearCart() {
      return [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart;
export const selectCartCount = (state: RootState) =>
  state.cart.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
  state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
