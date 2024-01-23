import React from "react";
import ProductReviewCard from "../product_review_card";

export default function RenderProductListWithFilter({
  productlist,
  isError,
}: {
  productlist: productList;
  isError: boolean;
}) {
  return (
    <div className="bg-white w-full mt-2">
      <ul className="w-full flex flex-row flex-wrap">
        {productlist.length != 0 ? (
          productlist.map((item, index) => {
            return (
              <li
                className="w-2/4 lg:w-1/3 flex ps-1 flex-none "
                key={item.product_id}
              >
                <ProductReviewCard productInfo={item} />
              </li>
            );
          })
        ) : isError ? (
          <h5 className="text-center text-base w-full rounded p-2 ">
            Có lỗi xảy ra khi tải danh sách sản phẩm
          </h5>
        ) : (
          <h5 className="text-center text-base w-full rounded p-2 ">
            Không tìm thấy sản phẩm
          </h5>
        )}
      </ul>
    </div>
  );
}
