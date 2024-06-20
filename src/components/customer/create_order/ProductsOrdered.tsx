"use client";
import {
  CreateOrderProduct,
  CreateOrderProductAndAmount,
} from "@/components/dto/product";
import formatPrice from "@/utils/formatPrice";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import React from "react";

export default function ProductsOrdered({
  products,
}: {
  products: CreateOrderProductAndAmount[];
}) {
  return (
    <div className="flex flex-col  bg-white flex-wrap rounded-sm p-2">
      {products.length == 0 ? (
        <h5 className="text-center text-base w-full rounded p-2 ">
          Có lỗi xảy ra khi tải danh sách sản phẩm
        </h5>
      ) : (
        products.map((item) => {
          return (
            <div
              key={item.id}
              className=" mb-2 rounded-lg bg-white p-6 border sm:flex sm:justify-start"
            >
              <div className="w-[180px]">
                <img
                  src={getWebViewLinkFromWebContentLink(item.image)}
                  alt="product-image"
                  className="w-auto rounded-lg max-h-[120px]  mx-auto"
                />
              </div>
              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div className="mt-5 sm:mt-0">
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.products.name}
                  </h2>
                  <p className="mt-1 text-xs text-gray-700">{"vàng 256GB"}</p>
                  <p className="text-base mt-3">
                    Giá bán:{" "}
                    <span className="text-red-500 font-semibold">
                      {formatPrice(item.selling_price)} đ
                    </span>
                  </p>
                  {item.discount > 0 && (
                    <p className="text-sm line-through mt-1">
                      Giá gốc:{" "}
                      <span className="text-red-500">
                        {formatPrice(item.original_price)} đ
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
  );
}
