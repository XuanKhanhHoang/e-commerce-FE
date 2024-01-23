"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
export default function Pagination({
  itemsPerPage,
  totalPage,
  rootDirection = "/",
  forcePage = 1,
  scrollTop = true,
}: {
  itemsPerPage?: number;
  totalPage: number;
  rootDirection: string;
  forcePage?: number;
  scrollTop?: boolean;
}) {
  const router = useRouter();
  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    router.push(
      rootDirection +
        (rootDirection.includes("?") ? "&" : "?") +
        "page=" +
        (event.selected + 1),
      { scroll: scrollTop }
    );
  };

  return (
    <ReactPaginate
      breakLabel={<span className="mr-4">...</span>}
      nextLabel={
        <div className="text-nowrap">
          <i className="fa-solid fa-chevron-right"></i>
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      }
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={totalPage}
      previousLabel={
        <div className="text-nowrap">
          <i className="fa-solid fa-chevron-left "></i>
          <i className="fa-solid fa-chevron-left "></i>
        </div>
      }
      forcePage={forcePage - 1}
      containerClassName="flex items-center justify-center mt-4 mb-4 bg-white p-2 rounded font-medium"
      previousClassName="p-1 me-1 md:p-2 md:me-2"
      nextClassName="p1 md:p-2 md:ms-1"
      pageClassName=" hover:bg-[#fafafa] hover:border hover:border-gray-300 w-7 h-7 md:w-10 md:h-10  flex items-center justify-center rounded-md mr-4 text-main"
      activeClassName="!border !border-[#ccc] !bg-[#f1efef]"
    />
  );
}
