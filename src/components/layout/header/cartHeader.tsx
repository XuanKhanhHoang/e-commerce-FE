"use client";

import { cartItem, refreshCart } from "@/redux/feature/cart";
import { AppDispatch, AppUseSelector } from "@/redux/store";
import CustomFetch from "@/utils/fetch";
import { Session } from "next-auth";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function CartHeader({
  sessionProps: session,
}: {
  sessionProps: Session | null;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const cartNumber = AppUseSelector(
    (state) => state.CartReducer.value.total_amount
  );
  useEffect(() => {
    const getCart = async () => {
      if (!session?.user?.access_token) return;
      try {
        let res = await CustomFetch("/cart/getcart", {
          headers: { Authorization: "Bearer " + session?.user?.access_token },
        });
        if (res.ok) {
          let data: { totalPage: number; value: cartItem[] } = await res.json();
          dispatch(refreshCart(data.value));
        }
      } catch (e) {}
    };
    getCart();
  }, [session?.user?.access_token]);
  return (
    <Link className="text-center  " href={"/cart"}>
      <div className="relative inline-block me-2">
        <i className="fa-solid fa-cart-shopping p-2 cursor-pointer"></i>
        <span className="bg-orange-500 px-1 absolute rounded font-bold bottom-0 right-0 text-xs">
          {cartNumber}
        </span>
      </div>

      <span className="font-semibold hidden md:contents">Giỏ hàng</span>
    </Link>
  );
}
