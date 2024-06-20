import CreateOrderMain from "@/components/customer/create_order/CreateOrderMain";
import { notFound } from "next/navigation";

import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: {
    product_option_id: string | string[] | undefined;
    amount: string | string[] | undefined;
  };
}) {
  let products_option_id, amounts;
  try {
    products_option_id =
      searchParams.product_option_id != undefined
        ? searchParams.product_option_id?.length != 1
          ? (searchParams.product_option_id as string[]).map((item) => {
              let n = Number(item);
              if (isNaN(n)) throw Error();
              else return n;
            })
          : [Number(searchParams.product_option_id)]
        : undefined;
    if (products_option_id == undefined || isNaN(products_option_id[0]))
      throw Error();
    amounts =
      searchParams.amount != undefined
        ? searchParams.amount?.length != 1
          ? (searchParams.amount as string[]).map((item) => {
              let n = Number(item);
              if (isNaN(n)) throw Error();
              else return n;
            })
          : [Number(searchParams.amount)]
        : undefined;
    if (amounts == undefined || isNaN(amounts[0])) throw Error();
    if (amounts.length != products_option_id.length) throw Error();
  } catch (e) {
    return notFound();
  }
  return (
    <>
      <div className="flex flex-row  bg-white p-2 rounded-sm items-center flex-wrap justify-center">
        <i className="fa-solid text-2xl fa-money-check"></i>
        <h1 className=" text-center  w-fit text-2xl font-bold p-2">
          Xác nhận thanh toán
        </h1>
      </div>
      <div className=" max-w-screen-lg  mx-auto ">
        <CreateOrderMain
          productsOptionId={products_option_id}
          amounts={amounts}
        />
      </div>
    </>
  );
}
