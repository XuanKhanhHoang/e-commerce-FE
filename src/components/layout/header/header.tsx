"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import NavCategoryMobile from "./navCategoryMobile";
import NavCategoryDefault from "./navCategoryDefault";
import SearchComponents from "./search";
import { signOut, useSession } from "next-auth/react";
import "./header.css";
import { userGeneral } from "@/components/dto/user.dto";
import { Session } from "next-auth";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import CartHeader from "./cartHeader";
const Header = ({
  categoryList,
  sessionProps,
  auth,
}: {
  categoryList: categoryList;
  sessionProps: Session | null;
  auth: {
    isValidToken: boolean;
    data: { access_token: string; value: userGeneral } | undefined;
  };
}) => {
  const [isShowMobileNav, setIsShowMobileNav] = useState<boolean>(false);
  const { update } = useSession();
  const updated = useRef(false);
  if (typeof window != "undefined" && !updated.current) {
    console.log("auth", auth);
    updated.current = true;
    if (auth.isValidToken) {
      update({ ...sessionProps, value: auth.data });
    }
  }
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
        <div className=" flex justify-center items-center me-1 md:me-8 text-white ">
          {sessionProps ? (
            <div className="relative" id="accountInfoContainer">
              <Link className="p-2 me-2 flex items-center" href={"/customer"}>
                <img
                  src={
                    getWebViewLinkFromWebContentLink(
                      sessionProps?.user?.value.avatar
                    ) || "/img.png"
                  }
                  width={30}
                  height={30}
                  className="rounded-full me-1"
                  alt="avatar"
                />
                <span className="font-semibold hidden md:contents">
                  {sessionProps?.user?.value.first_name}
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
            <Link className="p-2 me-2 flex items-center" href={"/auth/login"}>
              <i className="fa-regular fa-user p-2"></i>
              <span className="font-semibold hidden md:contents">
                Đăng nhập
              </span>
            </Link>
          )}
          <CartHeader sessionProps={sessionProps} />
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
          <NavCategoryMobile
            categoryList={categoryList}
            session={sessionProps}
          />
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
