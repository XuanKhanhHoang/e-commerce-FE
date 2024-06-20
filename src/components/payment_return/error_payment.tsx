import Link from "next/link";
import React from "react";

export default function ErrorPayment({ order_id }: { order_id: string }) {
  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white p-6  md:mx-auto">
        <div className=" mx-auto h-12 w-12 rounded-full bg-red-600 flex">
          <i className="fa-solid fa-xmark text-[2rem] block m-auto text-center"></i>
        </div>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Thanh toán Thất bại
          </h3>
          <p className="text-gray-600 my-2">
            Thanh toán thất bại{" "}
            {order_id != "-1"
              ? `cho mã đơn hàng ${order_id}!`
              : "do lỗi bất định !"}
          </p>
          <div className="py-10 text-center">
            <Link
              href="/"
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
