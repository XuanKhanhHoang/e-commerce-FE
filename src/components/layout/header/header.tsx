"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavCategoryMobile from "./navCategoryMobile";
import NavCategoryDefault from "./navCategoryDefault";
import SearchComponents from "./search";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import "./header.css";
import fetch from "@/utils/fetch";
import { userGeneral } from "@/components/dto/user.dto";
import { Session } from "next-auth";
const Header = ({
  categoryList,
  sessionProps,
}: {
  categoryList: {
    id: number;
    name: String;
    icon: String;
  }[];
  sessionProps: Session | null;
}) => {
  const [isShowMobileNav, setIsShowMobileNav] = useState<boolean>(false);
  const { data: session, update } = useSession();
  useEffect(() => {
    const checkValidToken = async () => {
      let accessToken = sessionProps?.user?.access_token;
      if (!accessToken) return;
      let res: Response = await fetch("/auth/getinfobyaccesstoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: accessToken.trim(),
        }),
        cache: "no-cache",
      });
      if (!res.ok) return signOut();
      let user: { access_token: string; value: userGeneral } = await res.json();
      update({
        ...sessionProps,
        user: {
          access_token: user.access_token,
          value: user.value,
        },
      });
    };
    checkValidToken();
  }, []);
  return (
    <header className=" sticky mb-4 shadow-sm  bg-main ">
      <div className="max-w-screen-xl flex items-center mx-auto pb-2 py-3">
        <div
          className="p-2 px-6 block md:hidden cursor-pointer"
          id="triggerSubNavMobile"
          onClick={() => {
            setIsShowMobileNav(!isShowMobileNav);
          }}
        >
          <i className="fa-solid fa-bars text-lg text-white"></i>
        </div>
        <Link className="w-auto h-[50px] relative mx-auto" href={"/"}>
          <img src="/logo.png" className="h-[50px]" alt="logo" />
        </Link>
        <div className="w-2/5 hidden md:block">
          <SearchComponents />
        </div>
        <div className=" flex justify-center items-center me-8 text-white ">
          {session ? (
            <div className="relative" id="accountInfoContainer">
              <Link className="p-2 me-2 flex items-center" href={"/customer"}>
                <Image
                  src={session?.user?.value.avatar || "/img.png"}
                  width={30}
                  height={30}
                  className="rounded-full me-1"
                  alt="avatar"
                />
                <span className="font-semibold hidden md:contents">
                  {session?.user?.value.first_name}
                </span>
              </Link>
              <button
                className="font-semibold text-[#3d71e7] ms-2  p-3 absolute bg-white  rounded hidden min-w-[130px]"
                id="btnLogout"
                onClick={() => {
                  signOut();
                }}
              >
                {" "}
                Đăng xuất
                <i className="fa-solid fa-arrow-right-from-bracket p-1"></i>
              </button>
            </div>
          ) : (
            <Link className="p-2 me-2 flex items-center" href={"/login"}>
              <i className="fa-regular fa-user p-2"></i>
              <span className="font-semibold hidden md:contents">
                Đăng nhập
              </span>
            </Link>
          )}
          <Link className="text-center  " href={"/cart"}>
            <div className="relative inline-block me-2">
              <i className="fa-solid fa-cart-shopping p-2 cursor-pointer"></i>
              <span className="bg-orange-500 px-1 absolute rounded font-bold bottom-0 right-0 text-xs">
                {0}
              </span>
            </div>

            <span className="font-semibold hidden md:contents">Giỏ hàng</span>
          </Link>
        </div>
      </div>

      {/* sidebar */}
      <div className={"md:hidden  bg-white"} id="subNavMobile">
        <div className="h-[1px]  bg-white "></div>

        <div
          className={
            "relative opacity-100 " +
            (isShowMobileNav == false
              ? " max-h-0 invisible "
              : " max-h-[1000px] !visible  ")
          }
          style={{
            transition: "max-height 0.7s, visibility 0.2s",
          }}
        >
          <NavCategoryMobile categoryList={categoryList} session={session} />
        </div>
      </div>

      <NavCategoryDefault categoryList={categoryList} />
      <div className="md:hidden w-4/5 mx-auto rounded  py-2">
        <SearchComponents />
      </div>
    </header>
  );
};

export default Header;
