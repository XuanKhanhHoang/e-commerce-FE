import React from "react";
import RenderProductList from "../product/productlist/productlist";
import Pagination from "../layout/pagination/pagination";
import CustomFetch from "@/utils/fetch";

export const AllProduct = async () => {
  let productlist: productList = [];
  let totalPage = 0;
  try {
    let res: Response = await CustomFetch(
      `/product/productlist?product_per_page=${8}`,
      {
        cache: "default",
      }
    );
    if (res.ok) {
      let result: { data: productList; totalPage: number } = await res.json();
      productlist = result.data;
      totalPage = result.totalPage;
    }
  } catch (error) {}
  return (
    <div className="w-full">
      <div className="flex justify-between w-full my-8  items-center ">
        <div className=" relative text-base ms-10 h-fit text-white bg-main rounded-sm py-1 w-full  md:w-64 lg:w-72 uppercase font-medium text-center text-nowrap">
          Sản phẩm:
          <div
            className=" absolute z-10 w-0 h-0 top-0 left-[-40px]"
            style={{
              height: 0,
              borderLeft: "30px solid #009981",
              borderRight: "40px solid #00483d",
              borderBottom: "32px solid #009981",
            }}
          ></div>
        </div>
      </div>
      <RenderProductList productlist={productlist} />
      {totalPage > 0 && (
        <Pagination
          itemsPerPage={14}
          totalPage={totalPage}
          rootDirection={"/productlist"}
        />
      )}
    </div>
  );
};
