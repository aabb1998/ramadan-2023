import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "@reduxjs/toolkit";
import counterSlice from "../Redux/counter";
import cartSlice from "../Redux/cart";
import thunk from "redux-thunk";

export default configureStore({
  reducer: { counterSlice, cartSlice },
  middleware: [thunk],
});
