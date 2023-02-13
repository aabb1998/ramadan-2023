import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "@reduxjs/toolkit";
import counterSlice from "../Redux/counter";
import thunk from "redux-thunk";

export default configureStore({
  reducer: { counterSlice },
  middleware: [thunk],
});
