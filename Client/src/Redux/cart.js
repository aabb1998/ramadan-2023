import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    removeFromCart: (state, action) => {
      const removeItem = state.cartItems.filter(
        (item) => item.campaignId !== action.payload
      );
      state.cartItems = removeItem;
    },
    addItemToCart: (state, action) => {
      if (
        state.cartItems.filter(
          (item) => item.campaignId === action.payload.campaignId
        ).length > 0
      ) {
        console.log("Found");

        let oldObject = state.cartItems.find(
          (item) => item.campaignId === action.payload.campaignId
        );
        action.payload.amount += oldObject.amount;

        const filteredData = state.cartItems.filter(
          (item) => item.campaignId !== action.payload.campaignId
        );
        state.cartItems = filteredData;

        state.cartItems.push({ ...action.payload });
      } else {
        console.log("Not found");
        state.cartItems.push({ ...action.payload });
      }
    },
  },
});

export const { removeFromCart, addItemToCart } = cartSlice.actions;

export default cartSlice.reducer;
