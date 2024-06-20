import MainResetPwdForm from "@/components/auth/resetpassword/mainResetPwdForm";
import { isValidEmail } from "@/utils/isValidEmail";
import { notFound } from "next/navigation";
import React from "react";

type resetPasswordSearchParams = {
  access_token: string;
  email: string;
};
export default function Page({
  searchParams,
}: {
  searchParams: resetPasswordSearchParams;
}) {
  const email = decodeURI(searchParams.email);
  if (!isValidEmail(email)) notFound();
  const access_token = decodeURI(searchParams.access_token);
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-3 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Thay đổi mật khẩu cho <span className="">{email}</span>
            </h1>
            <MainResetPwdForm access_token={access_token} email={email} />
          </div>
        </div>
      </div>
    </section>
  );
}
