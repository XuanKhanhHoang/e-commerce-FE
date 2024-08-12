import { options } from "@/app/api/auth/[...nextauth]/options";
import CreateOrderMain from "@/components/customer/create_order/CreateOrderMain";
import { provineList } from "@/components/customer/customer_info/customerInfor";
import { createOrderItem } from "@/components/dto/order.dto";
import {
  CreateOrderProduct,
  CreateOrderProductAndAmount,
} from "@/components/dto/product";
import { UserFullDetail } from "@/components/dto/user.dto";
import checkIsValidAddressFormat from "@/utils/checkIsValidGetAddressFormat";
import CustomFetch from "@/utils/fetch";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: {
    product_option_id: string | string[] | undefined;
    amount: string | string[] | undefined;
  };
}) {
  let products_option_id, amounts;
  let session = await getServerSession(options);
  let user: UserFullDetail | undefined;
  let orderItems: CreateOrderProductAndAmount[] = [];
  let provineList: provineList = { results: [] };

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

    let optionsAmount: number[] = [];
    let idOrderItems: { option_id: number }[] = [];
    for (let i = 0; i < products_option_id.length; i++) {
      idOrderItems.push({
        option_id: products_option_id[i],
      });
      optionsAmount[products_option_id[i]] = amounts[i];
    }
    const params = new URLSearchParams();
    idOrderItems.forEach((item) => {
      for (const key in item) {
        params.append("products_option_id", item.option_id.toString());
      }
    });

    let [getCustomerRespose, getProductResponse, getProvineListRespose] =
      await Promise.all([
        await CustomFetch("/customer/customer_detail", {
          headers: { Authorization: "Bearer " + session?.user?.access_token },
        }),
        CustomFetch(
          "/product/get_product_option_basic_info_list?" + params.toString()
        ),
        fetch("https://vapi.vnappmob.com/api/province/", {
          cache: "force-cache",
        }),
      ]);
    if (getCustomerRespose.ok) {
      user = await getCustomerRespose.json();
      if (!checkIsValidAddressFormat(user?.address || "")) user!.address = ",,";
    }
    //  else redirect("/");
    if (getProductResponse.ok) {
      let res: {
        totalPage: number;
        value: CreateOrderProduct[];
      } = await getProductResponse.json();
      // if (res.totalPage == 0) redirect("/");\
      orderItems = res.value.map((item) => ({
        ...item,
        amount: optionsAmount[item.id],
      }));
    }
    if (getProvineListRespose.ok) {
      provineList = await getProvineListRespose.json();
    }
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
          user={user}
          ordersItem={orderItems}
          accessToken={session!.user!.access_token}
          provineList={provineList}
        />
      </div>
    </>
  );
}
