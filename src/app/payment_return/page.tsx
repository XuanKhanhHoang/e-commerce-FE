import ErrorPayment from "@/components/payment_return/error_payment";
import SuccessPayment from "@/components/payment_return/success_payment";
import { notFound } from "next/navigation";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: {
    status: string;
    order_id: string;
  };
}) {
  if (
    searchParams.order_id == undefined ||
    searchParams.status == undefined ||
    isNaN(Number(searchParams.status)) ||
    isNaN(Number(searchParams.order_id))
  )
    return notFound();
  if (searchParams.status != "00")
    return <ErrorPayment order_id={searchParams.order_id} />;
  return <SuccessPayment order_id={searchParams.order_id} />;
}
