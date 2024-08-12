import { UserFullDetail } from "@/components/dto/user.dto";
import checkIsValidAddressFormat from "@/utils/checkIsValidGetAddressFormat";
import React from "react";

export type districtList = {
  results: district[];
};
export type district = {
  district_id: string; //* It's number string
  district_name: string;
};
export type provineList = {
  results: provine[];
};
export type provine = {
  province_id: string; //* It's number string
  province_name: string;
  province_type: string;
};
export default async function CustomerInfo({
  userDetail,
}: {
  userDetail: UserFullDetail | undefined;
}) {
  let province: string = "",
    district: string = "",
    restAddress: string = "";
  console.log("valid", userDetail?.address);
  if (checkIsValidAddressFormat(userDetail?.address || ""))
    try {
      let [provineId, districtId, rest] = (
        userDetail as UserFullDetail
      ).address.split(",", 3);
      restAddress = rest;
      let [provineListResponse, districtNameResponse] = await Promise.all([
        fetch("https://vapi.vnappmob.com/api/province/", {
          cache: "force-cache",
        }),
        fetch(`https://vapi.vnappmob.com/api/province/district/${provineId}`, {
          cache: "force-cache",
        }),
      ]);
      if (provineListResponse.ok) {
        let provineList: provineList = await provineListResponse.json();
        let tmp = provineList.results.find(
          (item) => item.province_id == provineId
        );
        if (tmp != undefined) {
          province = tmp.province_name;
        }
      }

      if (districtNameResponse.ok) {
        let results: districtList = await districtNameResponse.json();
        let tmp = results.results.find(
          (item) => item.district_id == districtId
        );
        if (tmp != undefined) {
          district = tmp.district_name;
        }
      }
    } catch (e) {
      console.log(e);
    }
  return (
    <div className="text-gray-700">
      <div className="grid md:grid-cols-2 text-sm">
        <div className="grid grid-cols-2">
          <div className="px-3 py-2 font-semibold">Tên</div>
          <div className="px-3 py-2">{userDetail?.first_name || ""}</div>
        </div>
        <div className="grid grid-cols-2">
          <div className="px-3 py-2 font-semibold">Họ</div>
          <div className="px-3 py-2">{userDetail?.last_name}</div>
        </div>
        <div className="grid grid-cols-2">
          <div className="px-4 py-2 font-semibold">Giới tính</div>
          <div className="px-4 py-2">{userDetail?.gender ? "Nam" : "Nữ"}</div>
        </div>
        <div className="grid grid-cols-2">
          <div className="px-4 py-2 font-semibold">Số điện thoại</div>
          <div className="px-4 py-2">
            {userDetail?.phone_number || "Chưa có số điện thoại"}
          </div>
        </div>
        <div className="flex">
          <div className="px-4 py-2 font-semibold">Địa chỉ</div>
          <p className="px-4 py-2 text-wrap">{`${restAddress}, ${district}, ${province} `}</p>
        </div>

        <div className="flex">
          <div className="px-4 py-2 font-semibold">Email </div>
          <div className="px-4 py-2">
            <a className="text-blue-800">
              {userDetail?.email || "Địa chỉ email trống"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
