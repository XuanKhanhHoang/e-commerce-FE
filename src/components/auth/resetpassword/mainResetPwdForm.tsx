"use client";

import CustomFetch from "@/utils/fetch";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function MainResetPwdForm({
  access_token,
  email,
}: {
  email: string;
  access_token: string;
}) {
  const [isPwdError, setIsPwdError] = useState(false);
  const [isRePwdError, setIsRePwdError] = useState(false);
  const [isMatchPassword, setIsMatchPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (isLoading) return;
    let password = (
      document.getElementById("new_password") as HTMLInputElement
    ).value.trim();
    let rePassword = (
      document.getElementById("re_new_password") as HTMLInputElement
    ).value.trim();
    setIsPwdError(password.length < 6);
    setIsRePwdError(rePassword.length < 6);
    setIsMatchPassword(password != rePassword);
    let isInvalid =
      password.length < 6 || rePassword.length < 6 || password != rePassword;
    if (!isInvalid) {
      setIsLoading(true);
      try {
        let res = await CustomFetch("/customer/change_password", {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ new_password: password }),
        });
        if (!res.ok) {
          setIsLoading(false);
          return toast.error("Có lỗi xảy ra ", { autoClose: 600 });
        }
        toast.success("Thay đổi mật khẩu thành công ,vui lòng đăng nhập ", {
          autoClose: 500,
          onClose: () => {
            router.push("/auth/login");
          },
        });
      } catch (e) {
        setIsLoading(false);
        toast.error("Có lỗi xảy ra ", { autoClose: 600 });
      }
    }
  };
  return (
    <form className="space-y-4 md:space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Mật khẩu mới
        </label>
        <input
          type="password"
          name="new_password"
          id="new_password"
          className={
            (isPwdError ? " border-red-600 " : "border-gray-300") +
            " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
          }
          placeholder="••••••••"
          required
        />
        {isPwdError && (
          <Typography
            placeholder={""}
            variant="small"
            color="red"
            className="mt-2 flex items-center gap-1 font-normal"
          >
            Mật khẩu phải lớn hơn hoặc bằng 6 chữ số
          </Typography>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Nhập lại mật khẩu
        </label>
        <input
          type="password"
          name="re_new_password"
          id="re_new_password"
          className={
            (isRePwdError || isMatchPassword
              ? "border-red-600"
              : "border-gray-300") +
            " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
          }
          placeholder="••••••••"
          required
        />
        {isRePwdError && (
          <Typography
            placeholder={""}
            variant="small"
            color="red"
            className="mt-2 flex items-center gap-1 font-normal"
          >
            Mật khẩu phải lớn hơn hoặc bằng 6 chữ số
          </Typography>
        )}
        {isMatchPassword && (
          <Typography
            placeholder={""}
            variant="small"
            color="red"
            className="mt-2 flex items-center gap-1 font-normal"
          >
            Nhập lại mật khẩu không khớp
          </Typography>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full text-white bg-green-500 hover:bg-green-600 shadow-none focus:ring-0 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        {isLoading ? "Loading..." : "Thay đổi mật khẩu"}
      </button>
    </form>
  );
}
