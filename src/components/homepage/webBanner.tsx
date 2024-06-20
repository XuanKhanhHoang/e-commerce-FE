import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import React from "react";
import PromotionBannerCarousel from "./promotionBannerCarousel";

export default async function WebBanner() {
  let bannerCarousel: promotionBanner[] = [];
  let bannerStatic: promotionBanner[] = [];
  try {
    let resPromotionBanner: Response = await fetch("/webinfo/promotionbanner");
    if (resPromotionBanner.ok) {
      let data: promotionBanner[] = await resPromotionBanner.json();
      if (data.length != 0)
        data.map((item) => {
          if (item.type == 1) bannerCarousel.push(item);
          else {
            bannerStatic.push(item);
          }
        });
    }
  } catch (error) {}
  return (
    <>
      <PromotionBannerCarousel bannerList={bannerCarousel} />
      <div className="flex no-scrollbar overflow-scroll w-full mt-2">
        {bannerStatic.length != 0 &&
          bannerStatic.map((item) => {
            return (
              <div
                className="px-2 flex-none w-1/2 md:w-1/3 lg:w-1/4 max-w-[300px] mx-auto"
                key={item.id}
              >
                <img
                  src={getWebViewLinkFromWebContentLink(item.image)}
                  alt=""
                  className="w-full"
                />
              </div>
            );
          })}
      </div>
    </>
  );
}
