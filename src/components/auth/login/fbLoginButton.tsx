"use client";
import { Button } from "@material-tailwind/react";
import { signIn } from "next-auth/react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

export default function FacebookLoginButton({ isError }: { isError: boolean }) {
  const handleLoginByFacebook = () =>
    signIn("facebook", {
      callbackUrl: "/",
    });

  useEffect(() => {
    if (isError) toast.error("Có lỗi xảy ra khi đăng nhập");
  }, []);
  return (
    <Button
      size="lg"
      variant="gradient"
      color="light-blue"
      type="button"
      className="group relative flex items-center gap-3 overflow-hidden pr-[72px] mx-auto !mt-3"
      placeholder={""}
      onClick={handleLoginByFacebook}
    >
      Đăng nhập bằng
      <span className="absolute right-0 grid h-full w-12 place-items-center bg-light-blue-600 transition-colors group-hover:bg-light-blue-700">
        <i className="fa-brands fa-facebook-f text-white"></i>
      </span>
    </Button>
  );
}
