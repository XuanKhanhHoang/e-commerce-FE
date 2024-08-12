import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  districtList,
  provineList,
} from "@/components/customer/customer_info/customerInfor";
import { Order, OrderFullInfo } from "@/components/dto/order.dto";
import PaymentButton from "@/components/customer/order/payment_button";
import CustomFetch from "@/utils/fetch";
import formatPrice from "@/utils/formatPrice";
import formatTime from "@/utils/formatTime";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { it } from "node:test";
import React from "react";
import CancelOrderButton from "@/components/customer/order/cancel_order_button";

export default async function page({
  searchParams,
}: {
  searchParams: {
    order_id: string;
  };
}) {
  const orderId = Number(searchParams.order_id);
  if (isNaN(orderId) || orderId < 0) return notFound();
  let order: OrderFullInfo;
  let access_token = (await getServerSession(options).then(
    (res) => res?.user?.access_token
  )) as string;
  let province, district, restAddress: string | undefined;
  try {
    let [res, provineList] = await Promise.all([
      CustomFetch("/order/get_order?order_id=" + orderId, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }),
      fetch("https://vapi.vnappmob.com/api/province/", {
        cache: "force-cache",
      }).then(async (res) => {
        if (res.ok) return (await res.json()) as provineList;
        else return undefined;
      }),
    ]);
    if (res.ok) {
      order = await res.json();
    } else return notFound();
    if (provineList && provineList.results) {
      let [province_id, district_id, rest] = order.delivery_address.split(
        ",",
        3
      );
      restAddress = rest;
      let tmp = provineList.results.find(
        (item) => item.province_id == province_id
      );
      province = tmp?.province_name;
      if (province) {
        district = await fetch(
          `https://vapi.vnappmob.com/api/province/district/${province_id}`,
          {
            cache: "force-cache",
          }
        ).then(async (res) => {
          if (res.ok) {
            let dctLst = (await res.json()) as districtList;
            return dctLst.results.find(
              (item) => item.district_id == district_id
            )?.district_name;
          } else return undefined;
        });
      }
    }
  } catch (error) {
    return notFound();
  }
  return (
    <>
      <div className="flex flex-row  bg-white p-2 rounded-sm items-center flex-wrap justify-center">
        <i className="fa-solid text-2xl fa-money-check"></i>
        <h1 className=" text-center  w-fit text-2xl font-bold p-2">
          Thông tin đơn hàng
        </h1>
      </div>
      <div className=" max-w-screen-lg  mx-auto ">
        <div className="my-2  bg-white w-full rounded-sm p-2">
          <div className="p-2 flex flex-col">
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Mã đơn hàng :
                </label>
                <input
                  type="text"
                  defaultValue={order.id}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Thời gian đặt hàng :
                </label>
                <input
                  type="text"
                  defaultValue={formatTime(order.createAt)}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Trạng thái đơn hàng :
                </label>
                <input
                  type="text"
                  defaultValue={order.status.status_name}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            {order.status.id == 5 && (
              <div className="w-full flex flex-wrap px-4 py-2 ms-2 justify-center items-center">
                <div className="text-sm me-3 text-orange-600">
                  Đơn hàng này chưa được thanh toán, vui lòng thanh toán để giao
                  hàng{" "}
                </div>
                <PaymentButton accessToken={access_token} order_id={order.id} />
              </div>
            )}
            {order.status.id == 2 && order.receivedAt && (
              <div className=" w-full">
                <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                  <label className="block mb-2 text-sm font-semibold text-gray-900">
                    Thời gian nhận hàng :
                  </label>
                  <input
                    type="text"
                    defaultValue={formatTime(order.receivedAt)}
                    readOnly
                    className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                  />
                </div>
              </div>
            )}
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Tên Người Nhận :
                </label>
                <input
                  type="text"
                  defaultValue={order.recipient_name}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Số điện thoại nhận hàng :
                </label>
                <input
                  type="text"
                  defaultValue={order.phone_number}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 ms-2">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Địa chỉ nhận hàng :
                </label>
                <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
                  <span className="text-sm font-normal w-[90px]">
                    Tỉnh thành :
                  </span>
                  <input
                    type="text"
                    defaultValue={province || "Có lỗi xảy ra"}
                    readOnly
                    className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                  />
                </div>
                <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
                  <span className="text-sm font-normal w-[90px]">
                    Quận huyện :
                  </span>
                  <input
                    type="text"
                    defaultValue={district || "Có lỗi xảy ra"}
                    readOnly
                    className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                  />
                </div>
                <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
                  <span className="text-sm font-normal ">
                    Địa chỉ chính xác (Xã,số nhà,...) :
                  </span>

                  <input
                    type="text"
                    defaultValue={restAddress || "Có lỗi xảy ra"}
                    readOnly
                    className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                  />
                </div>
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Phương thức thanh toán :
                </label>
                <input
                  type="text"
                  defaultValue={order.payment_method.name}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Tổng số tiền :
                </label>
                <input
                  type="text"
                  defaultValue={formatPrice(order.value)}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Tổng tiền hàng:
                </label>
                <input
                  type="text"
                  defaultValue={formatPrice(order.value - order.deliver_fee)}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="px-4 py-2 text-wrap flex flex-row ms-2 justify-between items-center flex-wrap">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Phí vận chuyển :
                </label>
                <input
                  type="text"
                  defaultValue={formatPrice(order.deliver_fee)}
                  readOnly
                  className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                />
              </div>
            </div>
            <hr className="my-1" />
            <div className="w-full flex flex-wrap px-4 py-2 ms-2 items-center">
              <div className="text-base me-3 font-semibold">Bạn muốn :</div>
              {(order.status.id == 5 || order.status.id == 1) && (
                <CancelOrderButton
                  accessToken={access_token}
                  order_id={order.id}
                />
              )}
              {order.status.id == 5 && (
                <PaymentButton accessToken={access_token} order_id={order.id} />
              )}
              {order.status.id == 3 && true && (
                <button className=" ms-3 p-2 bg-yellow-300 text-sm rounded text-white hover:bg-yellow-500">
                  Đánh giá đơn hàng
                </button>
              )}
              {order.status.id == 3 && true && (
                <button className=" ms-3 p-2 bg-red-500 text-sm rounded text-white hover:bg-red-700">
                  Hoàn trả đơn hàng
                </button>
              )}

              <button className=" ms-3 p-2 px-5 bg-brown-700 text-sm rounded text-white hover:bg-brown-900">
                Liên hệ
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col  bg-white flex-wrap rounded-sm p-2">
          <h5 className="p-2 ms-2 text-lg w-full font-medium ">
            Danh sách sản phẩm:
          </h5>

          {order.order_list.length == 0 ? (
            <h5 className="text-center text-base w-full rounded p-2 ">
              Có lỗi xảy ra khi tải danh sách sản phẩm
            </h5>
          ) : (
            order.order_list.map((item) => {
              return (
                <div
                  key={item.id}
                  className=" mb-2 rounded-lg bg-white p-6 border sm:flex sm:justify-start"
                >
                  <div className="w-[180px]">
                    <img
                      src={getWebViewLinkFromWebContentLink(item.option.image)}
                      alt="product-image"
                      className="w-auto rounded-lg max-h-[120px]  mx-auto"
                    />
                  </div>
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">
                        {item.option.products.name}
                      </h2>
                      <p className="mt-1 text-xs text-gray-700">
                        {"vàng 256GB"}
                      </p>
                      <p className="text-base mt-3">
                        Giá bán:{" "}
                        <span className="text-red-500 font-semibold">
                          {formatPrice(item.price)} đ
                        </span>
                      </p>
                      {item.discount > 0 && (
                        <p className="text-sm line-through mt-1">
                          Giá gốc:{" "}
                          <span className="text-red-500">
                            {formatPrice(
                              (item.price / (100 - item.discount)) * 100
                            )}{" "}
                            đ
                          </span>
                        </p>
                      )}
                      <p className="text-base mt-1">
                        Số lượng:{" "}
                        <span className=" rounded  bg-white text-center text-base  font-medium ">
                          {item.amount}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
