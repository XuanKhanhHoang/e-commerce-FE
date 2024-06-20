"use client";

import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import { Carousel } from "@material-tailwind/react";

export default function PromotionBannerCarousel({
  bannerList,
}: {
  bannerList: promotionBanner[];
}) {
  return (
    <>
      {bannerList.length != 0 ? (
        <Carousel
          className=" w-full  bg-white relative h-56 overflow-hidden rounded-lg md:h-96"
          placeholder={""}
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
              {new Array(length).fill("").map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                    activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
          transition={{ type: "tween", duration: 0.5 }}
          autoplay={true}
          loop={true}
        >
          {bannerList.map((item) => {
            return (
              <img
                src={getWebViewLinkFromWebContentLink(item.image)}
                alt="image 1"
                className="  ease-in-out h-96 mx-auto absolute block w-full max-h-full"
                key={item.id}
              />
            );
          })}
        </Carousel>
      ) : (
        <div></div>
      )}
    </>
  );
}
