"use client";

import { useEffect } from "react";

export default function ProductDescription({
  productInfomation,
  productDescription,
}: {
  productDescription: string;
  productInfomation: string;
}) {
  useEffect(() => {
    const $product_description_container = document.getElementById(
      "product_description_container"
    );
    const screenWidthLg = 960; //px
    const containerHeight = {
      normal: 20 * 16, //rem to px
      lg: 37 * 16, //rem to px
    };
    const $showMoreDescriptionButton =
      document.getElementById("show_more_button");
    if (screen.width < screenWidthLg) {
      if (
        $product_description_container!.clientHeight > containerHeight.normal
      ) {
        $showMoreDescriptionButton!.style.display = "block";
      }
    } else {
      if ($product_description_container!.clientHeight > containerHeight.lg) {
        $showMoreDescriptionButton!.style.display = "block";
      }
    }
    $showMoreDescriptionButton!.onclick = () => {
      if ($showMoreDescriptionButton!.innerText == "Xem thêm") {
        $product_description_container!.classList.replace(
          "lg:max-h-[37rem]",
          "lg:h-fit"
        );
        $product_description_container!.classList.replace("max-h-80", "h-fit");
        $showMoreDescriptionButton!.innerText = "Thu nhỏ";
      } else {
        $product_description_container!.classList.replace("h-fit", "max-h-80");
        $product_description_container!.classList.replace(
          "lg:h-fit",
          "lg:max-h-[37rem]"
        );
        $showMoreDescriptionButton!.innerText = "Xem thêm";
      }
    };
  }, []);
  return (
    <div className="w-full lg:w-2/3 px-4 pb-4 mb-4 bg-white ">
      <h5 className="block w-full px-2 py-3 bg-gray-100 text-lg uppercase font-normal my-3 rounded-sm">
        Chi tiết sản phẩm
      </h5>
      <div
        dangerouslySetInnerHTML={{ __html: productInfomation }}
        className="text-sm pl-2"
      ></div>
      <h5 className="block w-full px-2 py-3 bg-gray-100 text-lg uppercase font-normal my-3 rounded-sm">
        Mô tả sản phẩm
      </h5>
      <div
        dangerouslySetInnerHTML={{ __html: productDescription }}
        className="text-sm pl-2 mb-2 max-h-80 lg:max-h-[37rem] overflow-hidden"
        id="product_description_container"
      ></div>
      <button
        type="button"
        id="show_more_button"
        className=" hidden mx-auto focus:outline-none  text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Xem thêm
      </button>
    </div>
  );
}
