"use client";

import CustomFetch from "@/utils/fetch";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CancelOrderButton({
  order_id,
  accessToken,
}: {
  order_id: number;
  accessToken: string;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const router = useRouter();
  const handleCancelOrder = async () => {
    try {
      let res = await CustomFetch("/order/cancel_order", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          order_id: order_id,
        }),
      });
      if (res.ok) {
        toast.success("Hủy đơn thành công !");
        router.push("/customer");
        router.refresh();
        return;
      } else {
        toast.error("Có lỗi khi xảy ra , vui lòng kiểm tra lại");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra , vui lòng kiểm tra lại ");
    }
  };
  return (
    <>
      <button
        className="p-2 bg-red-700 text-sm rounded text-white hover:bg-red-900"
        onClick={handleOpen}
      >
        Hủy đơn hàng
      </button>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        placeholder={""}
      >
        <DialogHeader placeholder={""}>
          Bạn chắc chắn muốn hủy chứ !
        </DialogHeader>
        <DialogBody placeholder={""}>
          <Textarea label="Vui lòng nhập lí do muốn hủy đơn hàng" />
        </DialogBody>
        <DialogFooter placeholder={""}>
          <Button
            placeholder={""}
            variant="text"
            color="green"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Bỏ qua</span>
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleCancelOrder}
            placeholder={""}
          >
            <span>Xác nhận</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
