"use client";

import CustomFetch from "@/utils/fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PaymentButton({
  order_id,
  accessToken,
}: {
  order_id: number;
  accessToken: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handlePayment = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      let res = await CustomFetch(
        "/order/get_payment_url_for_order?order_id=" + order_id,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        let result: { pay_url: string } = await res.json();
        return router.push(result.pay_url);
      }
      toast.error("Có lỗi khi lấy url thanh toán , vui lòng kiểm tra lại");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra , vui lòng kiểm tra lại ");
      setIsLoading(false);
    }
  };
  return (
    <button
      className="ms-3 p-2 bg-green-500 text-sm rounded text-white hover:bg-green-700"
      onClick={handlePayment}
    >
      Thanh toán
    </button>
  );
}
