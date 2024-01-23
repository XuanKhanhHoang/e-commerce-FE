import RenderProductList from "@/components/product/productlist/productlist";
import Link from "next/link";
import React from "react";
import fetch from "@/utils/fetch";

export default async function ProductListLimitedOverviewForAnType({
  typeName,
  href,
}: {
  typeName: string;
  href: string;
}) {
  let productlist: productList = [];
  try {
    let res: Response = await fetch("/product/productlist?page=" + 1, {
      cache: "no-store",
    });

    if (res.ok) {
      let data: getProductListResponse = await res.json();
      productlist = data.data;
    }
  } catch (error) {}
  return (
    <div className="w-full">
      <div className="flex justify-between w-full my-8  items-center ">
        <div className=" relative text-base ms-10 h-fit text-white bg-main rounded-sm py-1 w-3/5 sm:w-4/5  md:w-64 lg:w-72 uppercase font-medium text-center text-nowrap">
          {typeName} :
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
        <Link
          href={href}
          className="bg-main text-white rounded text-xs py-2 px-3 h-fit"
        >
          Xem thêm
        </Link>
      </div>
      <RenderProductList productlist={productlist} />
    </div>
  );
}
