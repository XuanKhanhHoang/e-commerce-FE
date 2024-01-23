"use client";
import truncateText from "@/utils/truncateText";
import Link from "next/link";
export default function FlashSaleCarousel({
  productList,
}: {
  productList: productList;
}) {
  if (productList.length == 0)
    return (
      <h5 className="text-center text-base w-full rounded-md bg-white mt-2">
        Có lỗi xảy ra khi tải danh sách sản phẩm
      </h5>
    );
  if (typeof window != "undefined" && productList.length != 0) {
    let $flashsaleContainer = document.getElementById(
      "flashsaleContainer"
    ) as HTMLElement;
    let $flashsaleSlider = document.getElementById(
      "flashsaleSlider"
    ) as HTMLElement;
    let $flashsaleItems = document.getElementsByClassName("flashsaleItem");
    let flashsaleContainerWidth = $flashsaleContainer.clientWidth;
    let elementToShow =
      flashsaleContainerWidth / $flashsaleItems[0].clientWidth;
    let flashsaleItemWidth = flashsaleContainerWidth / elementToShow;
    let maxDistanceSlide =
      -flashsaleItemWidth * ($flashsaleItems.length - elementToShow);
    $flashsaleSlider.style.width = flashsaleItemWidth * elementToShow + "px";
    const nextFlashsaleItem = () => {
      if (+$flashsaleSlider.style.marginLeft.slice(0, -2) != 0)
        $flashsaleSlider.style.marginLeft =
          +$flashsaleSlider.style.marginLeft.slice(0, -2) +
          flashsaleItemWidth +
          "px";
    };
    const preFlashsaleItem = () => {
      if (+$flashsaleSlider.style.marginLeft.slice(0, -2) >= maxDistanceSlide)
        $flashsaleSlider.style.marginLeft =
          +$flashsaleSlider.style.marginLeft.slice(0, -2) -
          flashsaleItemWidth +
          "px";
    };
    let btnPre = document.getElementById("btnPreFlashsale");
    if (btnPre) {
      btnPre.onclick = nextFlashsaleItem;
    }
    let btnNext = document.getElementById("btnNextFlashsale");
    if (btnNext) {
      btnNext.onclick = preFlashsaleItem;
    }
  }
  return (
    <div className="relative w-full rounded-md bg-white mt-2">
      {/* Carousel wrapper */}
      <div
        className="rounded-lg md:overflow-hidden overflow-scroll no-scrollbar pe-3"
        id="flashsaleContainer"
      >
        {/* Item 1 */}
        <ul
          className="w-full flex flex-row ease-linear"
          id="flashsaleSlider"
          style={{ transition: "margin 0.6s" }}
        >
          {productList.map((item) => {
            return (
              <ProductReviewCard productInfo={item} key={item.product_id} />
            );
          })}
        </ul>
      </div>

      <div className="hidden md:block">
        {/* Slider controls */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          id="btnPreFlashsale"
        >
          <span className="w-10 h-10 block">
            <i className="fa-solid fa-chevron-right block p-4 rounded-full bg-[#a5a5a5]"></i>
          </span>
        </button>
        <button
          type="button"
          className=" absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          id="btnNextFlashsale"
        >
          <span className="w-10 h-10 block">
            <i className="fa-solid fa-chevron-right block p-4 rounded-full bg-[#a5a5a5]"></i>
          </span>
        </button>
      </div>
    </div>
  );
}
function ProductReviewCard({
  productInfo,
}: {
  productInfo: productOfProductList;
}) {
  return (
    <li className="flashsaleItem w-2/4 md:w-1/3 lg:w-1/4  flex ps-1 flex-none ">
      <Link
        href={"/production?productId="}
        className="relative w-11/12 bg-white border p-2 border-gray-200 rounded-lg shadow my-2 mx-auto"
      >
        {productInfo.discount != 0 && (
          <span className="text-white bg-orange-500 p-2 text-sm absolute right-0 top-0 text-center rounded ">
            - {productInfo.discount} %
          </span>
        )}
        <div className="w-[200px] h-[150px] md:h-[180px] md:w-[225px] flex items-center mx-auto max-w-full">
          <img
            src={productInfo.logo}
            className="rounded-t-lg w-fit h-full mx-auto "
            alt=" "
          />
        </div>
        <hr className="h-[1px] mt-2" />

        <div className="p-2  ">
          <p className="mb-2 md:text-base font-semibold tracking-tight text-gray-900  text-sm text-center text-wrap">
            {truncateText(productInfo.name)}
          </p>
          <div className="flex flex-wrap items-center justify-evenly ">
            <span className="font-bold text-red-500 text-lg">
              {productInfo.price_sell} đ
            </span>
            <span
              className={
                "line-through text-sm opacity-70" +
                (productInfo.discount != 0 && "invisible")
              }
            >
              {productInfo.original_price} đ
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
