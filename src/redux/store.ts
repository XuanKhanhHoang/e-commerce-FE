import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./feature/cart";
import { type } from "os";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
const store = configureStore({
  reducer: { CartReducer },
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const AppUseSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
