import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import Link from "next/link";
import React from "react";

export default function NavCategoryDefault({
  categoryList,
}: {
  categoryList: categoryList;
}) {
  return (
    <nav className="hidden md:block bg-white px-5 py-1  mx-auto my-1 overflow-x-scroll w-full no-scrollbar  border border-t border-white">
      <ul className="flex justify-center">
        {categoryList.length == 0 ? (
          <li className="text-white py-2 px-3 text-center border-x ">
            Có lỗi xảy ra khi tải danh sách loại hàng
          </li>
        ) : (
          categoryList.map((item, index) => {
            return (
              <li
                className={
                  "text-main  px-3 pt-1 text-center border-collapse border-r !min-w-[80px] " +
                  (index == 0 ? " border-l " : "")
                }
                key={item.id}
              >
                <Link
                  className="text-xs flex flex-col justify-end  after:content-[''] hover:after:w-full after:h-[3px] after:mx-auto hover:after:bg-orange-400 after:block after:mt-1 after:rounded"
                  href={`/productlist?category_id=${item.id}`}
                >
                  <div className="mb-1">
                    <img
                      className="w-6 h-6 mx-auto"
                      src={getWebViewLinkFromWebContentLink(
                        item.icon.toString(),
                        30,
                        40
                      )}
                      alt=""
                    />
                  </div>
                  {item.name}
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </nav>
  );
}
