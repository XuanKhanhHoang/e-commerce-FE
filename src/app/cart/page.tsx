"use client";
import {
  cartItem,
  deleteProductFromCart,
  emptyCart,
  updateAmountAnProductInCart,
} from "@/redux/feature/cart";
import { AppDispatch, AppUseSelector } from "@/redux/store";
import CustomFetch from "@/utils/fetch";
import formatPrice from "@/utils/formatPrice";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Cart() {
  const router = useRouter();
  const cart = AppUseSelector((state) => state.CartReducer.value.cart);
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [choosedProduct, setChoosedProduct] = useState<cartItem[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const incrementVariationInCart = (cart_id: number) => {
    let index = cart.findIndex((item) => item.id == cart_id);
    if (index == -1) return;
    setChoosedProduct(
      choosedProduct.map((item) => {
        if (cart[index].id == item.id)
          return { ...item, amount: item.amount + 1 };
        else return item;
      })
    );
    dispatch(
      updateAmountAnProductInCart({
        cart_id: cart_id,
        amount: cart[index].amount + 1,
      })
    );
  };
  const decrementVariationInCart = (cart_id: number) => {
    let index = cart.findIndex((item) => item.id == cart_id);
    if (cart[index].amount - 1 == 0) return;
    if (index == -1) return;
    setChoosedProduct(
      choosedProduct.map((item) => {
        if (cart[index].id == item.id)
          return { ...item, amount: item.amount - 1 };
        else return item;
      })
    );
    dispatch(
      updateAmountAnProductInCart({
        cart_id: cart_id,
        amount: cart[index].amount - 1,
      })
    );
  };
  const handleChangeAmountVariationInCart = (val: string, cart_id: number) => {
    if (isNaN(Number(val)) && val != "") return;
    if (val == "") val = "0";
    let amount = Number(val);
    let index = cart.findIndex((item) => item.id == cart_id);
    if (index == -1) return;
    setChoosedProduct(
      choosedProduct.map((item) => {
        if (cart[index].id == item.id) item.amount = amount;
        return { ...item, amount: amount };
      })
    );
    dispatch(
      updateAmountAnProductInCart({ cart_id: cart[index].id, amount: amount })
    );
  };
  const handleDeleteProductInCart = async (cart_id: number) => {
    if (isDeleting) return toast.warning("Vui lòng chờ ", { autoClose: 250 });
    else setIsDeleting(true);
    try {
      let res = await CustomFetch("/cart/deleteproduct", {
        headers: {
          Authorization: "Bearer " + session?.user?.access_token,
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({ cart_id: cart_id }),
      });
      if (res.ok) {
        dispatch(deleteProductFromCart(cart_id));
        setChoosedProduct(choosedProduct.filter((item) => item.id != cart_id));
      }
    } catch (e) {
      toast.error("Có lỗi khi xóa sản phẩm khỏi giỏ hàng", { autoClose: 300 });
    }
    setIsDeleting(false);
  };
  const handleCheckout = async () => {
    if (choosedProduct.length == 0)
      return toast.error("Vui lòng chọn ít nhất 1 sản phẩm !", {
        autoClose: 300,
      });
    let data = choosedProduct.map((item) => {
      return { option: item.option.id, amount: item.amount };
    });
    const params = new URLSearchParams();
    data.forEach((item) => {
      params.append("product_option_id", item.option.toString());
      params.append("amount", item.amount.toString());
    });
    router.push("/customer/create_order?" + params.toString());
  };
  return (
    <>
      {cart.length != 0 ? (
        <div className=" bg-gray-100 pt-10 rounded">
          <h1 className="mb-10 text-center text-2xl font-bold ">Giỏ hàng</h1>
          <div className="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
              {cart.map((item: cartItem) => {
                return (
                  <div
                    key={item.id}
                    className="justify-between mb-6 rounded-lg bg-white md:p-6 p-2 shadow-md flex sm:justify-start"
                  >
                    <div className="mb-[0.125rem]  min-h-[1.5rem] ps-[1.5rem] flex justify-center items-center">
                      <input
                        onChange={(e) => {
                          if (!e.target.checked) {
                            (
                              document.getElementById(
                                "checkAll"
                              ) as HTMLInputElement
                            ).checked = false;
                            setChoosedProduct(
                              choosedProduct.filter(
                                (p) => p.option.id != item.option.id
                              )
                            );
                          } else {
                            if (choosedProduct.length + 1 == cart.length)
                              (
                                document.getElementById(
                                  "checkAll"
                                ) as HTMLInputElement
                              ).checked = true;
                            setChoosedProduct([...choosedProduct, item]);
                          }
                        }}
                        name="cartItemChkb"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 outline-none shadow-none "
                      />
                    </div>
                    <a href={"/product/" + item.id} className="m-auto">
                      <img
                        src={getWebViewLinkFromWebContentLink(
                          item.option.image
                        )}
                        alt="product-image"
                        className="w-auto rounded-lg max-h-[200px] mx-auto "
                      />
                    </a>
                    <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div className="mt-5 sm:mt-0">
                        <h2 className="text-lg font-bold text-gray-900">
                          {item.option.products.name}
                        </h2>
                        <p className="mt-1 text-xs text-gray-700">
                          {item.option.name}
                        </p>
                        <p className="text-base mt-3">
                          Giá bán:{" "}
                          <span className="text-red-500 font-semibold">
                            {formatPrice(item.option.price_sell || 0)} đ
                          </span>
                        </p>
                        {item.option.discount != 0 && (
                          <p className="text-sm line-through">
                            Giá gốc:{" "}
                            <span className="text-red-500">
                              {formatPrice(item.option.original_price || 0)} đ
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div className="flex items-center border-gray-100">
                          <span
                            className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            onClick={() => decrementVariationInCart(item.id)}
                          >
                            {" "}
                            -{" "}
                          </span>
                          <input
                            className="h-8 w-10 border bg-white text-center text-xs outline-none p-0 "
                            type="number"
                            value={item.amount == 0 ? "" : item.amount}
                            onKeyDown={(event) => {
                              if (event.keyCode === 69) {
                                event.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              handleChangeAmountVariationInCart(
                                e.target.value,
                                item.id
                              );
                            }}
                          />
                          <span
                            className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            onClick={() => incrementVariationInCart(item.id)}
                          >
                            {" "}
                            +{" "}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            className="flex items-center p-1 hover:text-red-500"
                            onClick={() => handleDeleteProductInCart(item.id)}
                          >
                            {" "}
                            <span className="me-2"> Xóa </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-5 w-5 cursor-pointer duration-150 "
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sub total */}
            <div className="md:w-1/3">
              <div className="flex flex-row items-center rounded-lg border bg-white p-3 shadow-md">
                <input
                  id="checkAll"
                  type="checkbox"
                  onChange={(e) => {
                    document
                      .getElementsByName("cartItemChkb")
                      .forEach((ele, key) => {
                        (ele as HTMLInputElement).checked = e.target.checked;
                      });
                    if (!e.target.checked) {
                      setChoosedProduct([]);
                    } else {
                      setChoosedProduct(cart);
                    }
                  }}
                  className="w-4 h-4 border me-3 border-gray-300 rounded bg-gray-50 outline-none shadow-none "
                />
                <label htmlFor="checkAll">Chọn tất cả</label>
              </div>
              <div className="mt-6 h-fit rounded-lg border bg-white p-6 shadow-md md:mt-2  ">
                <hr className="my-4" />
                <div className="flex justify-between">
                  <p className="text-lg font-bold">Thành tiền</p>
                  <div className="">
                    <p className="mb-1 text-lg font-bold">
                      {formatPrice(
                        choosedProduct.reduce(
                          (pre, cur) =>
                            pre + cur.amount * cur.option.price_sell,
                          0
                        )
                      )}
                      đ
                    </p>
                  </div>
                </div>
                <button
                  className="mt-6 w-full rounded-md bg-main py-1.5 font-medium text-blue-50 hover:bg-blue-600"
                  onClick={handleCheckout}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center bg-white p-5 rounded">
          Không có sản phẩm trong giỏ hàng
        </p>
      )}
    </>
  );
}
