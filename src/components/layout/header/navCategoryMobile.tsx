import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NavCategoryMobile({
  categoryList,
  session,
}: {
  categoryList: {
    id: number;
    name: String;
    icon: String;
  }[];
  session: Session | null;
}) {
  return (
    <>
      <div className="flex items-center p-2 py-3 bg-main text-white z-0">
        {session ? (
          <div className="flex items-center p-2 py-3 bg-main text-white justify-evenly w-full">
            <Link
              className="p-2 me-2 flex items-center flex-row ms-3"
              href={"/user/" + session?.user?.value.user_id}
            >
              <Image
                src={session?.user?.value.avatar || "/img.png"}
                width={30}
                height={30}
                className="rounded-full me-1"
                alt="avatar"
              />
              <span className="font-semibold md:hidden contents ms-3">
                {session?.user?.value.first_name}
              </span>
            </Link>
            <button
              className="font-semibold text-white ms-auto p-3"
              onClick={() => signOut()}
            >
              {" "}
              Đăng xuất
              <i className="fa-solid fa-arrow-right-from-bracket p-1"></i>
            </button>
          </div>
        ) : (
          <Link href={"/login"} className="flex flex-row">
            <button className="bg-white p-2 px-3 rounded-lg ms-3 me-2">
              <i className="fa-solid fa-user fs-2 text-[#3d71e7]"></i>
            </button>
            <div className="text-white ms-4">
              <h2 className="font-bold">Đăng nhập</h2>
              <p className="italic text-sm">Đăng nhập để nhận nhiều ưu đãi</p>
            </div>
          </Link>
        )}
      </div>
      <Link className="nav-link" href={`/`}>
        <i className="fa-solid fa-house p-2"></i>
        Trang chủ
      </Link>
      <ul className="p-0">
        <li className="bg-main text-white">
          <p className="text-lg font-semibold p-1 ">
            <i className="fa-solid fa-list p-2"></i>
            Danh mục sản phẩm
          </p>
        </li>
        {categoryList.length == 0 ? (
          <li className="text-green-700 py-2 px-3 text-center  mb-2 border-b">
            Có lỗi xảy ra khi tải danh sách loại hàng
          </li>
        ) : (
          categoryList.map((item) => {
            return (
              <li
                key={item.id}
                className="text-green-700 py-2 px-3 text-center  mb-2 border-b"
              >
                <Link
                  className="text-lg flex  justify-start  ms-6"
                  href={`/productlist?category_id=${item.id}`}
                >
                  <div className="me-3">
                    <i className={`${item.icon} text-2xl`}></i>
                  </div>
                  {item.name}
                  <div className="ms-auto">
                    <i className="fa-solid fa-play"></i>
                  </div>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}
