import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [
      {
        campaignName: "Orphan sponsorship",
        amount: 100,
        schedule: false,
        timeStart: null,
        timeEnd: null,
        timeframe: null,
        priceId: "2i3uh4iu432",
      },
      {
        campaignName: "Help",
        amount: 10230,
        schedule: true,
        timeStart: new Date(99, 11, 24),
        timeEnd: new Date(12, 12, 25),
        timeframe: "daily",
        priceId: "2i3uh4iu432",
      },
    ],
  },
  reducers: {},
});

export const {} = cartSlice.actions;

export default cartSlice.reducer;
