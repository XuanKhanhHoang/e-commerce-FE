"use client";
import React, { useEffect, useRef, useState } from "react";
import formatPrice from "@/utils/formatPrice";
import { UserCreateOrderDTO, UserFullDetail } from "@/components/dto/user.dto";
import CustomerInfo from "./CustomerInfo";
import { useSession } from "next-auth/react";
import { AppUseSelector } from "@/redux/store";
import CustomFetch from "@/utils/fetch";
import {
  CreateOrderProduct,
  CreateOrderProductAndAmount,
} from "@/components/dto/product";
import ProductsOrdered from "./ProductsOrdered";
import { toast } from "react-toastify";
import { createOrderItem } from "@/components/dto/order.dto";
import { redirect, useRouter } from "next/navigation";
export default function CreateOrderMain({
  productsOptionId,
  amounts,
}: {
  productsOptionId: number[];
  amounts: number[];
}) {
  const { data: session } = useSession();
  const fetched = useRef(false);
  const [isFetching, setIsFetching] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<UserCreateOrderDTO>({
    address: "",
    phone_number: "",
    recipient_name: "",
  });
  let [orderedProducts, setOrderedProducts] = useState<
    CreateOrderProductAndAmount[]
  >([]);
  const router = useRouter();
  let createOrderItems = useRef<createOrderItem[]>([]);
  useEffect(() => {
    let optionsAmount: number[] = [];
    const fetchProductData = async () => {
      let ordersItem: { option_id: number }[] = [];
      for (let i = 0; i < productsOptionId.length; i++) {
        ordersItem.push({
          option_id: productsOptionId[i],
        });
        optionsAmount[productsOptionId[i]] = amounts[i];
        createOrderItems.current.push({
          amount: amounts[i],
          option_id: productsOptionId[i],
        });
      }
      const params = new URLSearchParams();
      ordersItem.forEach((item) => {
        for (const key in item) {
          params.append("products_option_id", item.option_id.toString());
        }
      });
      let response = await CustomFetch(
        "/product/get_product_option_basic_info_list?" + params.toString()
      );

      if (response.ok) {
        let res: {
          totalPage: number;
          value: CreateOrderProduct[];
        } = await response.json();
        if (res.totalPage == 0) return;
        setOrderedProducts(
          res.value.map((item) => ({
            ...item,
            amount: optionsAmount[item.id],
          }))
        );
        fetched.current = true;
        setIsFetching(false);
      } else throw new Error();
    };
    const fectCustomerData = async () => {
      let res = await CustomFetch("/customer/customer_detail", {
        headers: { Authorization: "Bearer " + session?.user?.access_token },
      });
      if (res.ok) {
        let user: UserFullDetail = await res.json();
        setCustomerInfo({
          address: user.address,
          phone_number: user.phone_number,
          recipient_name: user.last_name + " " + user.first_name,
        });
      } else throw new Error();
    };
    const fetchData = async () => {
      if (fetched.current) return;
      try {
        if (!session?.user?.access_token) return;
        await fectCustomerData();
        await fetchProductData();
      } catch (e) {
        console.log(e);
        setIsFetching(false);
        toast.error("Có lỗi xảy ra", { autoClose: 500 });
      }
    };
    fetchData();
  }, [session]);
  const handleCheckout = async () => {
    let pay_method =
      (document.getElementById("pay_method") as HTMLSelectElement)?.value ||
      "1";
    try {
      let res = await CustomFetch("/order/create_order", {
        headers: {
          Authorization: "Bearer " + session?.user?.access_token,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: createOrderItems.current,
          payment_method_id: pay_method,
          recipient_name: customerInfo.recipient_name,
          phone_number: customerInfo.phone_number,
          address: customerInfo.address,
        }),
      });
      if (res.ok) {
        if (pay_method != "2") {
          toast.success("Đặt hàng thành công !");
          return router.push("/cart");
        } else {
          let result: { pay_url: string } = await res.json();
          return router.push(result.pay_url);
        }
      } else {
        toast.error("Có lỗi khi đặt hàng , vui lòng kiểm tra lại");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra , vui lòng kiểm tra lại ");
    }
  };
  return (
    <>
      {isFetching || session?.user?.access_token == undefined ? (
        <div className="flex items-center text-surface dark:text-white bg-white p-2 mt-2">
          <strong>Loading...</strong>
          <div
            className="ms-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          ></div>
        </div>
      ) : (
        <>
          <CustomerInfo
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
          />
          <ProductsOrdered products={orderedProducts} />
          <div className="my-2  bg-white rounded-sm p-2">
            <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
              <span className="text-xl font-normal ">
                Phương thức thanh toán:
              </span>
              <select
                id="pay_method"
                defaultValue={1}
                className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
              >
                <option value={1}>Thanh toán khi nhận hàng</option>
                <option value={2}>Thanh toán qua MoMo</option>
              </select>
            </div>
            <hr className="my-1" />

            <div className=" me-0 ms-auto mt-6 h-full rounded-lg  bg-white p-6  md:mt-0 md:w-1/3 ">
              <div className="flex justify-between">
                <p className="text-base font-semibold">Tổng tiền hàng</p>
                <div className="">
                  <p className="mb-1 text-base font-normal">
                    {formatPrice(
                      orderedProducts.reduce((pre, cur) => {
                        return pre + cur.amount * cur.selling_price;
                      }, 0)
                    )}
                    đ
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-base font-semibold">Phí vận chuyển</p>
                <div className="">
                  <p className="mb-1 text-base font-normal">
                    {formatPrice(25000)}đ
                  </p>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Thành tiền</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">
                    {formatPrice(
                      orderedProducts.reduce((pre, cur) => {
                        return pre + cur.amount * cur.selling_price;
                      }, 0) + 25000
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
        </>
      )}
    </>
  );
}
