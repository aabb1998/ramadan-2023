import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "@reduxjs/toolkit";
import counterReducer from "../Redux/counter";
import cartReducer from "../Redux/cart";
import thunk from "redux-thunk";

export default configureStore({
  reducer: { counter: counterReducer, cart: cartReducer },
  middleware: [thunk],
});
