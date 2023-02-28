import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    oneTimeDonation: 0,
    anonymous: false,
  },
  reducers: {
    removeFromCart: (state, action) => {
      const removeItem = state.cartItems.filter(
        (item) => item.campaignId !== action.payload
      );
      state.cartItems = removeItem;
    },
    setAnon: (state, action) => {
      state.anonymous = !state.anonymous;
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
    emptyCart: (state, action) => {
      state.cartItems = [];
    },
    addOneTimeDonation: (state, action) => {
      state.oneTimeDonation = 10;
    },
    removeOneTimeDonation: (state, action) => {
      state.oneTimeDonation = 0;
    },
  },
});

export const {
  removeFromCart,
  addItemToCart,
  emptyCart,
  addOneTimeDonation,
  removeOneTimeDonation,
  setAnon,
} = cartSlice.actions;

export default cartSlice.reducer;
