import Link from "next/link";
import React from "react";

export default function BreadcrumbComponent() {
  return (
    <nav
      className="flex px-5 py-3 text-gray-700 border "
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center ">
          <Link
            href="/"
            className="font-semibold inline-flex items-center text-sm  text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <i className="p-1 fa-solid fa-house"></i>
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <i className="fa-solid fa-chevron-right"></i>
            <Link
              href="/productlist"
              className="ms-1 text-sm font-semibold text-green-500 hover:text-main md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >
              Tìm kiếm
            </Link>
          </div>
        </li>
      </ol>
    </nav>
  );
}
