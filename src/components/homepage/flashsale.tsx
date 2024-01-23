"use client";

import FlashSaleCarousel from "./carouselFlashSale";

export default function FlashsaleComponents({
  productList,
}: {
  productList: productList;
}) {
  if (typeof window != "undefined") {
    let countDownDate = new Date("Jan 8, 2024 15:37:25").getTime();

    // Update the count down every 1 second
    let x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var input = countDownDate - now;

      // If the count down is finished, write some text and stop the interval
      if (input < 0) {
        clearInterval(x);
        return;
      }

      // Time calculations for days, hours, minutes and seconds
      var hours = Math.floor(input / (1000 * 3600));
      var minutes = Math.floor((input % (1000 * 3600)) / (1000 * 60));
      var seconds = Math.floor((input % (1000 * 60)) / 1000);
      // Display the result in the element with id="demo"
      document.getElementById("flashsale_count_hours_0")!.innerText =
        Math.floor(hours / 10) + "";
      document.getElementById("flashsale_count_hours_1")!.innerText =
        (hours % 10) + "";
      document.getElementById("flashsale_count_minutes_0")!.innerText =
        Math.floor(minutes / 10) + "";
      document.getElementById("flashsale_count_minutes_1")!.innerText =
        (minutes % 10) + "";
      document.getElementById("flashsale_count_second_0")!.innerText =
        Math.floor(seconds / 10) + "";
      document.getElementById("flashsale_count_second_1")!.innerText =
        (seconds % 10) + "";
    }, 1000);
  }
  return (
    <>
      <div className="flex justify-between w-full mt-8 p-1">
        <h3 className="text-xl md:text-3xl  font-extrabold text-orange-500">
          F<i className="fa-solid fa-bolt"></i>ASH SALE ONLINE
        </h3>
        <div className=" text-white font-bold ">
          <span
            className="bg-black p-1 md:p-3  rounded mx-1 text-sm"
            id="flashsale_count_hours_0"
          >
            24
          </span>
          <span
            className="bg-black p-1 md:p-3 rounded mx-1 text-sm"
            id="flashsale_count_hours_1"
          >
            24
          </span>
          <span className="text-gray-500 mx-1">:</span>
          <span
            className="bg-black p-1 md:p-3 rounded mx-1 text-sm"
            id="flashsale_count_minutes_0"
          >
            24
          </span>
          <span
            className="bg-black p-1 md:p-3 rounded mx-1 text-sm"
            id="flashsale_count_minutes_1"
          >
            24
          </span>
          <div className="hidden md:contents">
            <span className="text-gray-500 mx-1">:</span>
            <span
              className="bg-black p-3 rounded mx-1 text-sm"
              id="flashsale_count_second_0"
            >
              24
            </span>
            <span
              className="bg-black p-3 rounded mx-1 text-sm"
              id="flashsale_count_second_1"
            >
              24
            </span>
          </div>
        </div>
      </div>
      <FlashSaleCarousel productList={productList} />
    </>
  );
}
