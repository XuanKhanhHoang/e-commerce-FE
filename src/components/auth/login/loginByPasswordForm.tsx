"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastOptions, toast } from "react-toastify";

export default function LoginByPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const toastOption: ToastOptions<unknown> = {
    position: "top-right",
    autoClose: 800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    className: "max-h-3/4",
  };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    if (formData.get("password")!.toString().trim().length < 6) {
      setIsLoading(false);
      return toast.error("Vui lòng nhập mật khảu lớn hơn 6 chữ số", {
        autoClose: 500,
      });
    }
    const signInResponse = await signIn("user", {
      login_name: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });
    console.log(signInResponse);
    if (signInResponse?.ok && !signInResponse.error) {
      toast.success("Đăng nhập thành công", toastOption);
      router.push("/");
      return router.refresh();
    }
    setIsLoading(false);
    toast.error(
      signInResponse?.error != "fetch failed"
        ? "Sai tài khoản hoặc mật khẩu"
        : "Có lỗi xảy ra",
      toastOption
    );
  };
  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Tên đăng nhập
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
          placeholder="Tên đăng nhập"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Mật khẩu
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 outline-none shadow-none "
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="remember" className="text-gray-500 ">
              Nhớ mật khẩu
            </label>
          </div>
        </div>
        <Link
          href="/auth/forgot_password"
          className="text-sm font-medium text-primary-600 hover:underline "
        >
          Quên mật khẩu?
        </Link>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-green-500 hover:bg-green-600 shadow-none focus:ring-0 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        {isLoading ? "Loading..." : "Đăng nhập"}
      </button>
    </form>
  );
}
