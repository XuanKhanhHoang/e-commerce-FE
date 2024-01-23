import BreadcrumbComponent from "@/components/layout/breadcrumb/breadcrumb";
import FilterComponents from "@/components/layout/filter/filter";
import Pagination from "@/components/layout/pagination/pagination";
import RenderProductListWithFilter from "@/components/product/productlist/productListWithFilter";
import fetch from "@/utils/fetch";
import React from "react";

export default async function Category({
  searchParams,
}: {
  searchParams: {
    category_id: string | undefined;
    page: string | undefined;
    keyword: string | undefined;
    brand_id: string | undefined;
    rating: string | string[] | undefined;
    min_price: string | undefined;
    max_price: string | undefined;
    order_type: "ASC" | "DESC";
    order_col: "update_at" | "price_sell";
  };
}) {
  let categoryName = "Không tìm thấy lọai hàng";
  let productList: productList = [];
  let categoryList: categoryList = [];
  let brandList: brandList = [];
  let totalPage: number = 0;
  let isProductListError = true;
  let page = searchParams.page || 1;
  let keyword = searchParams.keyword;
  let brand_id = searchParams.brand_id
    ? Number(searchParams.brand_id)
    : undefined;
  let category_id = searchParams.category_id
    ? Number(searchParams.category_id)
    : undefined;
  let rating =
    searchParams.rating != undefined
      ? searchParams.rating?.length != 1
        ? (searchParams.rating as string[]).map((item) => Number(item))
        : [Number(searchParams.rating)]
      : undefined;
  let min_price = searchParams.min_price
    ? Number(searchParams.min_price)
    : undefined;
  let max_price = searchParams.max_price
    ? Number(searchParams.max_price)
    : undefined;
  let order_col = searchParams.order_col || "update_at";
  let order_type = searchParams.order_type || "ASC";
  if (order_col == "price_sell") {
  } //pass
  else if (order_col == "update_at") {
  } //pass
  else order_col = "update_at";

  if (order_type == "ASC") {
  } //pass
  else if (order_type == "DESC") {
  } //pass
  else order_type = "DESC";
  try {
    let resBrandList: Response = await fetch("/product/brandlist", {
      cache: "no-store",
    });
    if (resBrandList.ok) {
      let data: brandList = await resBrandList.json();
      brandList = data;
    }
    let resCategoryList: Response = await fetch("/product/categorylist", {
      cache: "no-store",
    });
    if (resCategoryList.ok) {
      let data: categoryList = await resCategoryList.json();
      categoryList = data;
    }
    let resProductList: Response = await fetch(
      `/product/productlist?page=${page}${
        category_id ? "&category_id=" + category_id : ""
      }${brand_id ? "&brand_id=" + brand_id : ""}${
        searchParams.keyword ? "&keyword=" + searchParams.keyword : ""
      }${
        rating != undefined && rating?.length != 0
          ? rating?.map((item) => "&rating=" + item).join("")
          : ""
      }${min_price != undefined ? `&min_price=${min_price}` : ""}${
        max_price != undefined ? `&max_price=${max_price}` : ""
      }${`&order_type=${order_type}`}${`&order_col=${order_col}`}`,
      { cache: "no-store" }
    );
    console.log(
      `/product/productlist?page=${page}${
        category_id ? "&category_id=" + category_id : ""
      }${brand_id ? "&brand_id=" + brand_id : ""}${
        searchParams.keyword ? "&keyword=" + searchParams.keyword : ""
      }${
        rating != undefined && rating?.length != 0
          ? rating?.map((item) => "&rating=" + item).join("")
          : ""
      }${min_price != undefined ? `&min_price=${min_price}` : ""}${
        max_price != undefined ? `&max_price=${max_price}` : ""
      }${`&order_type=${order_type}`}${`&order_col=${order_col}`}`
    );
    if (resProductList.ok) {
      let data: getProductListResponse = await resProductList.json();
      isProductListError = false;
      if (data.categoryName) categoryName = data.categoryName;
      productList = data.data;
      totalPage = data.totalPage;
    }
  } catch (e) {
    console.log(e);
  }
  return (
    <main className="">
      <BreadcrumbComponent />

      <div className="w-full flex flex-wrap">
        <FilterComponents
          categoryList={categoryList}
          brandList={brandList}
          searchParams={{
            category_id: category_id,
            keyword: keyword,
            brand_id: brand_id,
            rating: rating,
            max_price: max_price,
            min_price: min_price,
            order_col: order_col,
            order_type: order_type,
          }}
        />
        <div className="w-full md:w-2/3 lg:w-3/4">
          <RenderProductListWithFilter
            productlist={productList}
            isError={isProductListError}
          />
        </div>
      </div>
      <div className=" flex justify-center">
        <div className="w-fit ">
          {" "}
          <Pagination
            itemsPerPage={14}
            totalPage={totalPage}
            rootDirection={`/productlist?${
              category_id ? "&category_id=" + category_id : ""
            }${brand_id ? "&brand_id=" + brand_id : ""}${
              searchParams.keyword ? "&keyword=" + searchParams.keyword : ""
            }${
              rating != undefined && rating?.length != 0
                ? rating?.map((item) => "&rating=" + item).join("")
                : ""
            }${min_price != undefined ? `&min_price=${min_price}` : ""}${
              max_price != undefined ? `&max_price=${max_price}` : ""
            }${`&order_type=${order_type}`}${`&order_col=${order_col}`}`}
            forcePage={Number(page) || 1}
          />
        </div>
      </div>
    </main>
  );
}
