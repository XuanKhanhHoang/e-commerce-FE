"use client";
import { Rating } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
export default function FilterComponents({
  categoryList,
  brandList,
  searchParams,
}: {
  categoryList: categoryList;
  brandList: brandList;
  searchParams: {
    keyword: string | undefined;
    category_id: number | undefined;
    brand_id: number | undefined;
    rating: number[] | undefined;
    min_price: number | undefined;
    max_price: number | undefined;
    order_type: "ASC" | "DESC";
    order_col: "update_at" | "price_sell";
  };
}) {
  const router = useRouter();
  const [isFilterShow, setIsFilterShow] = useState(false);
  const [filterCondition, setFilterCondition] = useState<{
    min_price?: number | undefined;
    max_price?: number | undefined;
    category_id?: number | undefined;
    brand_id?: number | undefined;
    rating: number[];
    order_type: "ASC" | "DESC";
    order_col: "update_at" | "price_sell";
  }>({
    rating: searchParams.rating || [],
    category_id: searchParams.category_id,
    min_price: searchParams.min_price,
    max_price: searchParams.max_price,
    brand_id: searchParams.brand_id,
    order_type: searchParams.order_type,
    order_col: searchParams.order_col,
  });
  const handlePriceChange = (val: string, type: "min" | "max") => {
    let price = Number(val.trim());
    if (type == "max") {
      if (price >= 0 && !isNaN(price)) {
        setFilterCondition({
          ...filterCondition,
          max_price: val.length == 0 ? undefined : price,
        });
      }
    }
    if (type == "min")
      if (price >= 0 && !isNaN(price)) {
        setFilterCondition({
          ...filterCondition,
          min_price: val.length == 0 ? undefined : price,
        });
      }
  };

  function handleRatingChange(value: string) {
    let ratingVal = Number(value);
    if (
      filterCondition.rating.length != 0 &&
      filterCondition.rating.indexOf(ratingVal) != -1
    )
      return setFilterCondition({
        ...filterCondition,
        rating: filterCondition.rating.filter((item) => item != ratingVal),
      });
    setFilterCondition({
      ...filterCondition,
      rating: [...filterCondition.rating, ratingVal],
    });
  }
  const handleFilter = () => {
    let url = `/productlist?page=1${
      filterCondition.category_id
        ? "&category_id=" + filterCondition.category_id
        : ""
    }${
      filterCondition.brand_id ? "&brand_id=" + filterCondition.brand_id : ""
    }${searchParams.keyword ? "&keyword=" + searchParams.keyword : ""}${
      filterCondition.rating != undefined && filterCondition.rating?.length != 0
        ? filterCondition.rating?.map((item) => "&rating=" + item).join("")
        : ""
    }${
      filterCondition.min_price != undefined
        ? `&min_price=${filterCondition.min_price}`
        : ""
    }${
      filterCondition.max_price != undefined
        ? `&max_price=${filterCondition.max_price}`
        : ""
    }${`&order_type=${filterCondition.order_type}`}${`&order_col=${filterCondition.order_col}`}`;
    router.push(url);
  };
  function handleButtonClick() {
    setIsFilterShow(!isFilterShow);
  }
  useEffect(() => {
    setFilterCondition({
      rating: searchParams.rating || [],
      category_id: searchParams.category_id,
      min_price: searchParams.min_price,
      max_price: searchParams.max_price,
      brand_id: searchParams.brand_id,
      order_col: searchParams.order_col,
      order_type: searchParams.order_type,
    });
  }, [searchParams]);
  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 px-4 ">
      <button
        className="md:hidden mb-5 max-w-80 w-full text-center px-4 py-2 mx-auto  block text-lg text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600"
        onClick={handleButtonClick}
      >
        Lọc danh sách
      </button>
      <div
        className={
          (!isFilterShow && "hidden") +
          " md:block px-6 py-4 border border-gray-200 bg-white rounded shadow-sm"
        }
      >
        <h3 className="font-semibold mb-2">Giá </h3>
        <div className="flex flex-col">
          <div className="mb-4">
            <input
              name="min"
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="text"
              placeholder="Giá thấp nhất"
              value={
                filterCondition.min_price == undefined
                  ? ""
                  : filterCondition.min_price
              }
              onChange={(e) => handlePriceChange(e.target.value, "min")}
            />
          </div>

          <div className="mb-4">
            <input
              name="max"
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="text"
              placeholder="Giá cao nhất "
              value={
                filterCondition.max_price == undefined
                  ? ""
                  : filterCondition.max_price
              }
              onChange={(e) => handlePriceChange(e.target.value, "max")}
            />
          </div>

          <div className="mb-4">
            <button
              onClick={handleFilter}
              className="px-1 py-2 text-center w-full flex items-center justify-center text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Lọc<i className="fa-solid fa-filter p-2"></i>
            </button>
          </div>
          <div className="">
            <h3 className="font-semibold mb-2">Sắp xếp </h3>

            <select
              id="ordertype_filter"
              value={
                filterCondition.order_col + "," + filterCondition.order_type
              }
              onChange={(e) => {
                let val = e.target.value.trim().split(",");
                setFilterCondition({
                  ...filterCondition,
                  order_col: val[0] as "update_at" | "price_sell",
                  order_type: val[1] as "ASC" | "DESC",
                });
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value={"price_sell,ASC"}>Giá từ thấp đến cao</option>
              <option value={"price_sell,DESC"}>Giá từ cao đến thấp</option>
              <option value="update_at,DESC">Sản phẩm mới nhất trước</option>
              <option value="update_at,ASC">Sản phẩm cũ nhất trước</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className={
          (!isFilterShow && "hidden") +
          " md:block px-6 py-4 border border-gray-200 bg-white rounded shadow-sm"
        }
      >
        <div className="">
          <h3 className="font-semibold mb-2">Loại hàng</h3>

          <select
            id="category_filter"
            value={
              filterCondition.category_id == undefined
                ? -1
                : filterCondition.category_id
            }
            onChange={(e) => {
              setFilterCondition({
                ...filterCondition,
                category_id:
                  Number(e.target.value) != -1
                    ? Number(e.target.value)
                    : undefined,
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {categoryList.length != 0 ? (
              <option value={-1}>Chọn loại hàng</option>
            ) : (
              <option defaultChecked value={-1}>
                Có lỗi xảy ra khi tải danh sách loại hàng
              </option>
            )}
            {categoryList.length != 0 &&
              categoryList.map((item) => {
                return (
                  <option value={item.id} key={item.id}>
                    {item.name}{" "}
                  </option>
                );
              })}
          </select>
        </div>
        <div className=" mt-3">
          <h3 className="font-semibold mb-2">Thương hiệu</h3>

          <select
            id="brand_filter"
            value={
              filterCondition.brand_id == undefined
                ? -1
                : filterCondition.brand_id
            }
            onChange={(e) => {
              setFilterCondition({
                ...filterCondition,
                brand_id:
                  Number(e.target.value) != -1
                    ? Number(e.target.value)
                    : undefined,
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {brandList.length != 0 ? (
              <option value={-1}>Chọn thương hiệu</option>
            ) : (
              <option value={-1}>
                Có lỗi xảy ra khi tải danh sách thương hiệu
              </option>
            )}
            {brandList.length != 0 &&
              brandList.map((item) => {
                return (
                  <option value={item.id} key={item.id}>
                    {item.name}{" "}
                  </option>
                );
              })}
          </select>
        </div>
        <hr className="my-4" />

        <h3 className="font-semibold mb-2">Đánh giá</h3>
        <ul className="space-y-1">
          <li>
            {[5, 4, 3, 2, 1].map((item) => (
              <label key={item} className="flex items-center">
                <input
                  name="ratings"
                  type="checkbox"
                  value={item}
                  className="h-4 w-4 outline-none shadow-none rounded"
                  checked={
                    filterCondition.rating.length != 0 &&
                    filterCondition.rating?.indexOf(item) != -1
                  }
                  onChange={(e) => handleRatingChange(e.currentTarget.value)}
                />
                <span className="ml-2 text-gray-500">
                  <Rating
                    value={item}
                    placeholder={""}
                    readonly
                    unratedColor="amber"
                    ratedColor="amber"
                  />
                </span>
              </label>
            ))}
          </li>
        </ul>
      </div>
    </aside>
  );
}
