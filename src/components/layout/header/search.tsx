"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function SearchComponents() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let searchKey = searchTerm.trim();
    router.push(`/productlist${searchKey ? "?keyword=" + searchKey : ""}`);
  };
  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
  }, [searchParams]);
  return (
    <form
      className=" relative  shadow-md rounded-md h-9 mx-auto"
      onSubmit={(e) => handleSearch(e)}
    >
      <input
        className="border-0 text-sm font-normal rounded w-full p-2 h-full border-transparent focus:border-transparent focus:ring-0"
        type="text"
        placeholder="Hôm nay bạn cần gì??"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className=" absolute  text-black text-xs right-0 w-12 h-full  hover:opacity-30 "
        type="submit"
      >
        <i className="fa-solid fa-magnifying-glass text-lg"></i>
      </button>
    </form>
  );
}
