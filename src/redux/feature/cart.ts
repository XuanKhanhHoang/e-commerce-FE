import CustomFetch from "@/utils/fetch";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
type initialState = {
  value: CartState;
};
type CartState = {
  cart: cartItem[];
  total_amount: number;
};
export type cartItem = {
  option: {
    name: string;
    price_sell: number;
    original_price: number;
    amount: number;
    discount: number;
    image: string;
    id: number;
    products: {
      name: string;
    };
  };

  id: number;
  amount: number;
};
const initialState: initialState = {
  value: {
    cart: [],
    total_amount: 0,
  },
};

export const cart = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    refreshCart: (state, action: PayloadAction<cartItem[]>) => {
      let localCart: cartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      let cartItems: cartItem[] = action.payload;
      if (cartItems.length == 0 || !cartItems) {
        localStorage.setItem("cart", "[]");
        return;
      }
      let cart: cartItem[] = [];
      cartItems.map((item) => {
        let lcAmount =
          localCart.find((c) => c.option.id == item.option.id)?.amount || 1;
        if (lcAmount >= item.option.amount || lcAmount <= 0)
          lcAmount = item.option.amount;
        let tmp: cartItem = {
          ...item,
          amount: lcAmount,
        };
        cart.push(tmp);
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      state.value.cart = cart;
      state.value.total_amount = cart.length;
    },
    addProductToCart: (state, action: PayloadAction<cartItem>) => {
      const { cart } = state.value;
      const { payload } = action;
      const index = cart.findIndex(
        (item) => item.option.id == payload.option.id
      );
      if (index > -1) {
        // If the item exists, update its amount
        cart[index].amount = payload.amount;
      } else {
        // If the item does not exist, add it to the cart
        cart.push(payload);
      }
      // Update the amount property with the cart length
      state.value.total_amount = cart.length;
      // Save the cart to the local storage
      localStorage.setItem("cart", JSON.stringify(cart));
      // No need to return anything, Immer will handle it for you
    },
    updateAmountAnProductInCart: (
      state,
      action: PayloadAction<{ cart_id: number; amount: number }>
    ) => {
      const { cart } = state.value;
      const { payload } = action;
      if (action.payload.amount < 0) return;
      const index = cart.findIndex((item) => item.id == payload.cart_id);
      if (index > -1 && action.payload.amount <= cart[index].option.amount) {
        // If the item exists, update its amount
        cart[index].amount = payload.amount;
      }
      // Save the cart to the local storage
      localStorage.setItem("cart", JSON.stringify(cart));
      // No need to return anything, Immer will handle it for you
    },
    deleteProductFromCart: (state, action: PayloadAction<Number>) => {
      const { cart } = state.value;
      const { payload } = action;
      const index = cart.findIndex((item) => item.id == payload);
      if (index > -1) {
        // If the item exists, update its amount
        state.value.total_amount--;
        let tmpCart = cart.filter((item) => item.id != action.payload);
        state.value.cart = tmpCart;
        localStorage.setItem("cart", JSON.stringify(tmpCart));
      }
    },
    emptyCart: (state) => {
      state.value.cart = [];
      state.value.total_amount = 0;
    },
  },
});
export const {
  addProductToCart,
  deleteProductFromCart,
  refreshCart,
  updateAmountAnProductInCart,
  emptyCart,
} = cart.actions;
export default cart.reducer;
