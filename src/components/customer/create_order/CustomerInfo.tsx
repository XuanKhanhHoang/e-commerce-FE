"use client";
import { UserCreateOrderDTO } from "@/components/dto/user.dto";
import { isValidPhoneNumber } from "@/utils/isValidPhoneNumber";
import { Typography } from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { districtList, provineList } from "../customer_info/customerInfor";
import CustomFetch from "@/utils/fetch";

export default function CustomerInfo({
  customerInfo,
  setCustomerInfo,
  provineList,
  setIsLoading,
  setDeliverFee,
}: {
  customerInfo: UserCreateOrderDTO;
  setCustomerInfo: React.Dispatch<React.SetStateAction<UserCreateOrderDTO>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDeliverFee: React.Dispatch<React.SetStateAction<number>>;
  provineList: provineList;
}) {
  let [provineId, districtId, rest] = customerInfo.address.split(",", 3);
  const [restAddress, setRestAddress] = useState<string>(rest || "");
  const [districtList, setDistrictList] = useState<districtList>({
    results: [],
  });
  const [curProvineIndex, setCurProvineIndex] = useState(
    provineList?.results.findIndex((item) => item.province_id == provineId) || 1
  );
  const [curDistrictIndex, setCurDistrictIndex] = useState<number>(1);
  useEffect(() => {
    const getDistrictList = async () => {
      setIsLoading(true);
      try {
        await fetch(
          `https://vapi.vnappmob.com/api/province/district/${
            provineList?.results[curProvineIndex].province_id || "01"
          }`,
          {
            cache: "force-cache",
          }
        ).then(async (res) => {
          if (res.ok) {
            let districtListTmp: districtList = await res.json();
            setDistrictList(districtListTmp);
            let index =
              districtListTmp?.results.findIndex(
                (item) => item.district_id == districtId
              ) || 0;
            index = index != -1 ? index : 0;
            setCurDistrictIndex(index);
            await CustomFetch(
              "/order/get_delivery_fee?district_id=" +
                districtList.results[index].district_id
            ).then(async (res1) => {
              setDeliverFee((await res1.json()).fee || -1);
            });
          }
        });
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    };
    getDistrictList();
  }, [curProvineIndex]);
  useEffect(() => {
    const handle = async () => {
      setCustomerInfo({
        ...customerInfo,
        address: `${
          provineList?.results[curProvineIndex].province_id || "01"
        },${
          districtList?.results[curDistrictIndex]?.district_id || "001"
        },${restAddress}`,
      });
    };
    handle();
  }, [restAddress, curDistrictIndex, curProvineIndex]);
  useEffect(() => {
    const getDeliverFee = async () => {
      try {
        setIsLoading(true);
        let res = await CustomFetch(
          "/order/get_delivery_fee?district_id=" +
            districtList.results[curDistrictIndex].district_id
        );
        if (res.ok) {
          setDeliverFee((await res.json()).fee || -1);
        } else setDeliverFee(-1);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getDeliverFee();
  }, [curDistrictIndex]);
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
                "bg-gray-50 border w-full md:w-80 text-gray-900 text-sm rounded-sm mt-2"
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
                "bg-gray-50 border w-full md:w-80 text-gray-900 text-sm rounded-sm mt-2"
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
          <div className="px-4 py-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Địa chỉ
            </label>
            <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
              <span className="text-sm font-normal w-[90px]">Tỉnh thành :</span>
              <select
                value={curProvineIndex}
                onChange={(e) => {
                  let index = Number(e.target.value);
                  setCurProvineIndex(!isNaN(index) ? index : 1);
                }}
                className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
              >
                {provineList?.results &&
                  provineList?.results.map((item, index) => {
                    return (
                      <option value={index} key={item.province_id}>
                        {item.province_name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
              <span className="text-sm font-normal w-[90px]">Quận huyện :</span>
              <select
                value={curDistrictIndex}
                onChange={(e) => {
                  let index = Number(e.target.value);
                  setCurDistrictIndex(!isNaN(index) ? index : 1);
                }}
                className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
              >
                {districtList?.results &&
                  districtList?.results.map((item, index) => {
                    return (
                      <option value={index} key={item.district_id}>
                        {item.district_name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
              <span className="text-sm font-normal ">
                Địa chỉ chính xác (Xã,số nhà,...) :
              </span>
              <input
                type="text"
                value={restAddress}
                onChange={(e) => setRestAddress(e.target.value)}
                className={
                  (restAddress.length == 0
                    ? " border-red-600 "
                    : "border-gray-300") +
                  "bg-gray-50 border w-full md:w-80  text-gray-900 text-sm rounded-sm mt-2"
                }
                name="address_rest"
                required
              />
              {restAddress.length == 0 && (
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
    </div>
  );
}
