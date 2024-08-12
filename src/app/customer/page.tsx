import { getServerSession } from "next-auth";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";
import fetch from "@/utils/fetch";
import { UserFullDetail } from "@/components/dto/user.dto";
import formatTime from "@/utils/formatTime";
import truncateText from "@/utils/truncateText";
import formatPrice from "@/utils/formatPrice";
import Link from "next/link";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import { Order, orderResponse } from "@/components/dto/order.dto";
import AllOrder from "@/components/customer/allOrder";
import CustomFetch from "@/utils/fetch";
import CustomerInfo from "@/components/customer/customer_info/customerInfor";
import checkIsValidAddressFormat from "@/utils/checkIsValidGetAddressFormat";

export default async function page({
  searchParams,
}: {
  searchParams: {
    page: string | undefined;
  };
}) {
  const session = await getServerSession(options);
  let userDetail: UserFullDetail | undefined;
  let orderList: Order[] = [];
  let orderDeliveringList: Order[] = [];
  let totalPage = 0;
  let { page } = searchParams;
  if (isNaN(Number(page)) || page == undefined) page = "1";
  try {
    let [cusRes, orderRes] = await Promise.all([
      CustomFetch("/customer/customer_detail", {
        headers: { Authorization: "Bearer " + session?.user?.access_token },
        cache: "default",
      }),
      CustomFetch("/order/orderlist?page=" + page, {
        headers: { Authorization: "Bearer " + session?.user?.access_token },
        cache: "default",
      }),
    ]);
    if (orderRes.ok) {
      let result: orderResponse = await orderRes.json();
      totalPage = result.totalPage;
      orderList = result.value;
      orderDeliveringList = orderList.filter((item) => item.status.id == 2);
    }
    if (cusRes.ok) {
      userDetail = await cusRes.json();
      if (!checkIsValidAddressFormat(userDetail?.address || ""))
        userDetail!.address = ",,";
    }
  } catch (e) {}

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
                src={getWebViewLinkFromWebContentLink(userDetail?.avartar)}
                alt=""
                className="h-[200px] mx-auto"
              />
              <h1 className="text-gray-900 font-bold text-lg leading-8 my-1 text-center">
                {userDetail?.login_name || ""}
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
                <Link
                  href={"/customer/update_detail"}
                  className="pe-1 !ml-auto"
                >
                  <i className="fa-solid fa-gear"></i>{" "}
                  <span>Cập nhật thông tin</span>
                </Link>
              </div>
              <CustomerInfo userDetail={userDetail} />
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
                  {orderDeliveringList.length != 0 ? (
                    orderDeliveringList.map((item) => {
                      return (
                        <li key={item.id}>
                          <Link
                            href={"/customer/order?order_id=" + item.id}
                            className="text-teal-600"
                          >
                            {truncateText(item.name || "", 60)}
                          </Link>
                          <div className="text-blue-500 text-sm">
                            Trạng thái đơn hàng:{" "}
                            <span className="font-medium text-black">
                              Đang giao
                            </span>
                          </div>
                          <div className="text-red-600 text-md">
                            {formatPrice(item.value)} đ
                          </div>
                          <div className="text-gray-500 text-xs">
                            Thời gian đặt: {formatTime(item.createAt)}
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <h5 className="text-center"> Bạn chưa có đơn hàng nào </h5>
                  )}
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
                <AllOrder orderList={orderList} totalPage={totalPage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
