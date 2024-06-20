import Link from "next/link";

export default function SuccessPayment({ order_id }: { order_id: string }) {
  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white p-6  md:mx-auto">
        <div className="flex mx-auto h-12 w-12 rounded-full bg-green-400">
          <i className="fa-solid fa-check text-[2rem] block m-auto text-center text-white"></i>
        </div>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-white font-semibold text-center">
            Thanh toán Thành công
          </h3>
          <p className="text-gray-600 my-2">
            Thanh toán thành công cho mã đơn hàng {order_id}!
          </p>
          <div className="py-10 text-center">
            <Link
              href="/"
              className="px-12 bg-green-500 text-white font-semibold py-3"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
