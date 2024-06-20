"use client";
import { UserCreateOrderDTO } from "@/components/dto/user.dto";
import { isValidPhoneNumber } from "@/utils/isValidPhoneNumber";
import { Typography } from "@material-tailwind/react";
import React from "react";

export default function CustomerInfo({
  customerInfo,
  setCustomerInfo,
}: {
  customerInfo: UserCreateOrderDTO;
  setCustomerInfo: React.Dispatch<React.SetStateAction<UserCreateOrderDTO>>;
}) {
  return (
    <div className="my-2  bg-white w-full rounded-sm p-2">
      <Typography placeholder={""} variant="h5">
        Thông tin người đặt
      </Typography>
      <hr className="my-1" />
      <div className="p-2 flex flex-col">
        <div className=" w-full">
          <div className="px-4 py-2 text-wrap">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tên Người Nhận :
            </label>
            <input
              type="text"
              onChange={(e) =>
                setCustomerInfo({
                  ...customerInfo,
                  recipient_name: e.target.value.trim(),
                })
              }
              value={customerInfo.recipient_name}
              className={
                (customerInfo.recipient_name.length == 0
                  ? " border-red-600 "
                  : "border-gray-300") +
                " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
              }
              required
            />
            {customerInfo.recipient_name.length == 0 && (
              <Typography
                placeholder={""}
                variant="small"
                color="red"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                Tên người nhận không được để trống
              </Typography>
            )}
          </div>
        </div>
        <div className=" w-full">
          <div className="px-4 py-2 text-wrap">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Số điện thoại nhận hàng :
            </label>
            <input
              type="text"
              onChange={(e) =>
                setCustomerInfo({
                  ...customerInfo,
                  phone_number: e.target.value.trim(),
                })
              }
              value={customerInfo.phone_number}
              className={
                (!isValidPhoneNumber(customerInfo.phone_number)
                  ? " border-red-600 "
                  : "border-gray-300") +
                " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
              }
              required
            />
            {!isValidPhoneNumber(customerInfo.phone_number) && (
              <Typography
                placeholder={""}
                variant="small"
                color="red"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                Số điện thoại không hợp lệ
              </Typography>
            )}
          </div>
        </div>
        <div className=" w-full">
          <div className="px-4 py-2 text-wrap">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Địa chỉ :
            </label>
            <input
              type="text"
              onChange={(e) =>
                setCustomerInfo({
                  ...customerInfo,
                  address: e.target.value.trim(),
                })
              }
              value={customerInfo.address}
              className={
                (customerInfo.address.length == 0
                  ? " border-red-600 "
                  : "border-gray-300") +
                " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
              }
              required
            />
            {customerInfo.address.length == 0 && (
              <Typography
                placeholder={""}
                variant="small"
                color="red"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                Địa chỉ không được để trống
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
