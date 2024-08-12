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
import checkIsValidAddressFormat from "@/utils/checkIsValidGetAddressFormat";
import { provineList } from "../customer_info/customerInfor";
export default function CreateOrderMain({
  user,
  ordersItem,
  accessToken,
  provineList,
}: {
  user: UserFullDetail | undefined;
  ordersItem: CreateOrderProductAndAmount[];
  accessToken: string;
  provineList: provineList;
}) {
  const [customerInfo, setCustomerInfo] = useState<UserCreateOrderDTO>({
    address: user?.address || ",,",
    phone_number: user?.phone_number || "",
    recipient_name: user?.last_name + " " + user?.first_name || "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deliverFee, setDeliverFee] = useState<number>(-1);
  const router = useRouter();
  const handleCheckout = async () => {
    if (isLoading)
      return toast("Vui lòng chờ đòng bộ địa chỉ", { autoClose: 300 });
    let pay_method =
      (document.getElementById("pay_method") as HTMLSelectElement)?.value ||
      "1";
    let createOrderItems: createOrderItem[] = ordersItem.map((item) => ({
      amount: item.amount,
      option_id: item.id,
    }));
    try {
      let res = await CustomFetch("/order/create_order", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: createOrderItems,
          payment_method_id: pay_method,
          recipient_name: customerInfo.recipient_name,
          phone_number: customerInfo.phone_number,
          address: customerInfo.address,
        }),
      });
      if (res.ok) {
        if (pay_method != "2") {
          toast.success("Đặt hàng thành công !");
          router.push("/cart");
          router.refresh();
          return;
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
  useEffect(() => {
    console.log("mount1");

    return () => console.log("Cleanup..");
  }, []);
  return (
    <>
      <CustomerInfo
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        provineList={provineList}
        setDeliverFee={setDeliverFee}
        setIsLoading={setIsLoading}
      />
      <ProductsOrdered products={ordersItem} />
      <div className="my-2  bg-white rounded-sm p-2">
        <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
          <span className="text-xl font-normal ">Phương thức thanh toán:</span>
          <select
            id="pay_method"
            defaultValue={1}
            className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
          >
            <option value={1}>Thanh toán khi nhận hàng</option>
            <option value={2}>Thanh toán qua VNPay</option>
          </select>
        </div>
        <hr className="my-1" />

        <div className=" me-0 ms-auto mt-6 h-full rounded-lg  bg-white p-6  md:mt-0 md:w-1/3 ">
          <div className="flex justify-between">
            <p className="text-base font-semibold">Tổng tiền hàng</p>
            <div className="">
              <p className="mb-1 text-base font-normal">
                {formatPrice(
                  ordersItem.reduce((pre, cur) => {
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
                {deliverFee != -1
                  ? formatPrice(deliverFee) + " đ"
                  : "Có lỗi xảy ra "}
              </p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between">
            <p className="text-lg font-bold">Thành tiền</p>
            <div className="">
              <p className="mb-1 text-lg font-bold">
                {formatPrice(
                  ordersItem.reduce((pre, cur) => {
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
  );
}
