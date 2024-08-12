import { addProductToCart, cartItem } from "@/redux/feature/cart";
import CustomFetch from "@/utils/fetch";
import formatPrice from "@/utils/formatPrice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
type orderState = {
  amount: string;
  option: product_options;
  price: number;
};
export default function ProductOptions({
  productName,
  productOptions,
}: {
  productName: string;
  productOptions: product_options[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<orderState>({
    amount: "1",
    option: productOptions[0],
    price: productOptions[0].selling_price,
  });
  const decrement = (e: any) => {
    let value = Number(order.amount);
    if (value - 1 >= 1 && !Number.isNaN(value)) {
      setOrder({
        amount: (value - 1).toString(),
        price: (value - 1) * order.option.selling_price,
        option: order.option,
      });
    }
  };
  const increment = (e: any) => {
    let value = Number(order.amount);
    if (value + 1 <= order.option.amount && !Number.isNaN(value)) {
      setOrder({
        amount: (value + 1).toString(),
        price: (value + 1) * order.option.selling_price,
        option: order.option,
      });
    }
  };
  const checkValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value.trim());

    if (val <= order.option.amount && val >= 1 && !Number.isNaN(val)) {
      setOrder({
        amount: e.target.value.trim(),
        price: val * order.option.selling_price,
        option: order.option,
      });
    } else if (e.target.value == "") {
      setOrder({
        ...order,
        amount: "",
      });
    }
  };
  const checkIsAuth = () => {
    if (!session) {
      toast.warning("Bạn phải đăng nhập để thêm vào giỏ hàng", {
        autoClose: 700,
      });
      return router.push("/auth/login");
    }
  };
  const handleAddToCart = async () => {
    checkIsAuth();
    if (isNaN(Number(order.amount))) {
      return toast.error("Vui lòng chọn số lượng hàng hợp lệ !", {
        autoClose: 600,
      });
    }
    let res = await CustomFetch("/cart/addproduct", {
      headers: {
        Authorization: "Bearer " + session?.user?.access_token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ option_id: order.option.id }),
    });
    if (res.status == 409) {
      return toast.warning("Sản phẩm này đã có trong giỏ hàng !", {
        autoClose: 600,
      });
    } else if (!res.ok) {
      return toast.error("Có lỗi xảy ra !", {
        autoClose: 600,
      });
    }
    let result: { order_id: number } = await res.json();
    let data: cartItem = {
      amount: Number(order.amount),
      id: result.order_id,
      option: {
        amount: order.option.amount,
        discount: order.option.discount,
        image: order.option.image,
        id: order.option.id,
        name: order.option.name,
        original_price: order.option.original_price,
        price_sell: order.option.selling_price,
        products: {
          name: productName,
        },
      },
    };
    dispatch(addProductToCart(data));
    toast.success("Thêm sản phẩm vào giỏ hàng thành công", {
      autoClose: 600,
    });
  };
  const handleBuyNow = () => {
    checkIsAuth();
    router.push(
      `/customer/create_order?product_option_id=${order.option.id}&amount=${order.amount}`
    );
  };
  return (
    <>
      <div className="mb-3">
        <span className="text-2xl text-red-500 font-semibold me-2">
          {formatPrice(order.option.selling_price)} đ
        </span>
        {order.option.discount != 0 && (
          <span className="line-through text-sm opacity-70">
            {formatPrice(order.option.original_price)} đ
          </span>
        )}
      </div>
      <div className="mb-2">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Chọn loại hàng
        </h3>
        <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {productOptions.length != 0 &&
            productOptions.map((item, index) => {
              return (
                <li
                  key={item.id}
                  className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600 "
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={"list-radio-license" + index}
                      type="radio"
                      defaultValue={item.id}
                      name="list-radio"
                      defaultChecked={index == 0}
                      onChange={() =>
                        setOrder({
                          amount: "1",
                          option: productOptions[index],
                          price: productOptions[index].selling_price,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  focus:outline-none focus:ring-0 focus:border-gray-900 shadow-none"
                    />
                    <label
                      htmlFor={"list-radio-license" + index}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {item.name}
                    </label>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <hr />
      <div className=" flex  mt-2 px-4 items-center">
        <h5 className="me-6 text-nowrap">Thành tiền : </h5>
        <span className="text-2xl text-[#525252] font-semibold me-2 ">
          {formatPrice(order.price)} đ
        </span>
      </div>
      <div className=" flex  mt-2 px-4  items-center">
        <h5 className="me-6 text-nowrap">Số lượng : </h5>
        <div className="flex flex-row max-h-10 w-96 rounded-2xl relative bg-transparent mb-2  md:mb-0">
          <button
            data-action="decrement"
            onClick={decrement}
            className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 w-20 rounded-l cursor-pointer outline-none"
          >
            <span className="m-auto text-2xl font-thin">−</span>
          </button>
          {/* img         */}
          <input
            type="number"
            className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  border-none"
            value={order.amount}
            onChange={(e) => {
              checkValue(e);
            }}
          ></input>
          <button
            data-action="increment"
            onClick={increment}
            className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400  w-20 rounded-r cursor-pointer"
          >
            <span className="m-auto text-2xl font-thin">+</span>
          </button>
        </div>
      </div>
      <div className="flex justify-evenly mt-4">
        <button
          type="button"
          onClick={handleBuyNow}
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
        >
          Mua ngay
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
          onClick={handleAddToCart}
        >
          <i className="me-1 fa fa-shopping-basket" />
          Thêm vào giỏ hàng
        </button>
      </div>
    </>
  );
}
