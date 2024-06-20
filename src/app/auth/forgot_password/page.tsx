import MainForgotPwdForm from "@/components/auth/forgot_pasword/mainForgotPwdForm";
import React from "react";

export default function Page() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-3 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Quên mật khẩu
            </h1>
            <MainForgotPwdForm />
          </div>
        </div>
      </div>
    </section>
  );
}
