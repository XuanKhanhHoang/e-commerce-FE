import React from "react";
import Pagination from "../layout/pagination/pagination";
import { Order } from "../dto/order.dto";
import Link from "next/link";
import truncateText from "@/utils/truncateText";
import formatPrice from "@/utils/formatPrice";
import formatTime from "@/utils/formatTime";

export default function AllOrder({
  orderList,
  totalPage,
}: {
  orderList: Order[];
  totalPage: number;
}) {
  return (
    <>
      <ul className="list-inside space-y-2">
        {orderList.length != 0 ? (
          orderList.map((item, index) => {
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
          })
        ) : (
          <h5 className="text-center"> Bạn chưa có đơn hàng nào </h5>
        )}
      </ul>
      {totalPage > 0 && (
        <Pagination
          rootDirection="/customer"
          totalPage={totalPage || 1}
          scrollTop={false}
        />
      )}
    </>
  );
}
