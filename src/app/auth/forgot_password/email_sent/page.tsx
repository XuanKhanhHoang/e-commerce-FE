import { isValidEmail } from "@/utils/isValidEmail";
import { notFound } from "next/navigation";
import React from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  if (!searchParams.email || !isValidEmail(searchParams.email)) notFound();
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-3 mx-auto md:h-screen lg:py-0">
        <div className="w-full max-w-[700px] bg-white rounded-lg shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Đã gửi yêu cầu
            </h1>
            <p className="text-xs font-light leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Vui lòng click đã được gửi đến {searchParams.email} để lấy lại mật
              khẩu{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
