import { getServerSession } from "next-auth";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";
import fetch from "@/utils/fetch";
import { Order, UserFullDetailAndOrder } from "@/components/dto/user.dto";
import formatTime from "@/utils/formatTime";
import truncateText from "@/utils/truncateText";
import formatPrice from "@/utils/formatPrice";
import Link from "next/link";
import Pagination from "@/components/layout/pagination/pagination";

export default async function page() {
  const session = await getServerSession(options);
  let res = await fetch("/customer/customerDetail", {
    headers: { Authorization: "Bearer " + session?.user?.access_token },
  });
  let data: UserFullDetailAndOrder | undefined = undefined;
  let deliveringOrderList: Order[] = [];
  if (res.ok) {
    data = await res.json();
    deliveringOrderList = data!.orders.filter((item) => item.status.id == 2);
  }
  return (
    <div className="bg-gray-100">
      <div className="max-w-screen-xl mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto"
                  src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                  alt=""
                />
              </div>
              <img
                src={data?.avartar || ""}
                alt=""
                className="h-[200px] mx-auto"
              />
              <h1 className="text-gray-900 font-bold text-lg leading-8 my-1 text-center">
                {data?.login_name || ""}
              </h1>
            </div>
            <div className="my-4" />
          </div>
          <div className="w-full md:w-9/12 mx-2 ">
            <div className="bg-white p-1 md:p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">About</span>
                <Link href={"/customer/updatedetail"} className="pe-1 !ml-auto">
                  <i className="fa-solid fa-gear"></i>{" "}
                  <span>Cập nhật thông tin</span>
                </Link>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-3 py-2 font-semibold">Tên</div>
                    <div className="px-3 py-2">{data?.first_name || ""}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-3 py-2 font-semibold">Họ</div>
                    <div className="px-3 py-2">{data?.last_name}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Giới tính</div>
                    <div className="px-4 py-2">
                      {data?.gender ? "Nam" : "Nữ"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Số điện thoại</div>
                    <div className="px-4 py-2">
                      {data?.phone_number || "Chưa có số điện thoại"}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="px-4 py-2 font-semibold">Địa chỉ</div>
                    <p className="px-4 py-2 text-wrap">{data?.address}</p>
                  </div>

                  <div className="flex">
                    <div className="px-4 py-2 font-semibold">Email.</div>
                    <div className="px-4 py-2">
                      <a
                        className="text-blue-800"
                        href="mailto:jane@example.com"
                      >
                        {data?.email || "Địa chỉ email trống"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4" />
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div>
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                  <span className="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">
                    Các đơn hàng đang giao :
                  </span>
                </div>
                <ul className="list-inside space-y-2">
                  {deliveringOrderList.map((item, index) => {
                    return (
                      <li key={item.id}>
                        <Link
                          href={"/customer/order?order_id=" + item.id}
                          className="text-teal-600"
                        >
                          {truncateText(item.name, 30)}
                        </Link>
                        <div className="text-blue-500 text-sm">
                          Trạng thái đơn hàng:{" "}
                          <span className="font-medium text-black">
                            Đang giao
                          </span>
                        </div>
                        <div className="text-red-600 text-md">
                          {formatPrice(item.price)} đ
                        </div>
                        <div className="text-gray-500 text-xs">
                          Thời gian đặt: {formatTime(item.createAt)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                  <span className="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">Lịch sử đơn hàng :</span>
                </div>
                <ul className="list-inside space-y-2">
                  {data?.orders.map((item, index) => {
                    return (
                      <li key={item.id}>
                        <Link
                          href={"/customer/order?order_id=" + item.id}
                          className="text-teal-600"
                        >
                          {truncateText(item.name, 30)}
                        </Link>

                        <div className="text-blue-500 text-sm">
                          Trạng thái đơn hàng:{" "}
                          <span className="font-medium text-black">
                            {item.status.status_name}
                          </span>
                        </div>
                        <div className="text-red-600 text-md">
                          {formatPrice(item.price)} đ
                        </div>
                        <div className="text-gray-500 text-xs">
                          Thời gian đặt: {formatTime(item.createAt)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <Pagination
                  rootDirection="/customer"
                  totalPage={3}
                  scrollTop={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
