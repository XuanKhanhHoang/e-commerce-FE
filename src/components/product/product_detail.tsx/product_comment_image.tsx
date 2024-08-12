"use client";

import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import { useState } from "react";

export default function ProductImageCommentCarousel({
  imageArray,
}: {
  imageArray: { image: string }[];
}) {
  const [previewImage, setPriviewImage] = useState(-1);
  return (
    <div className="w-full ms-0 md:ms-10 mt-4">
      <div className="flex ms-1 md:ms-0 overflow-scroll no-scrollbar">
        {imageArray.length != 0 &&
          imageArray.map((item, index) => {
            return (
              <img
                key={index}
                src={getWebViewLinkFromWebContentLink(item.image)}
                onClick={() =>
                  setPriviewImage(
                    previewImage != -1
                      ? previewImage != index
                        ? index
                        : -1
                      : index
                  )
                }
                alt=""
                className="w-20 h-20 mx-1 cursor-pointer"
              />
            );
          })}
      </div>
      {previewImage != -1 && (
        <div className="mt-3 max-w-full">
          <img
            src={getWebViewLinkFromWebContentLink(
              imageArray[previewImage].image
            )}
            alt=""
            className="max-w-full max-h-80 "
          />
        </div>
      )}
    </div>
  );
}
