"use client";

import { Carousel } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
interface CarouselProps {
  defaultProps: {
    prevArrow: (args: {
      loop: boolean;
      handlePrev: () => void;
      activeIndex: number;
      firstIndex: boolean;
    }) => React.ReactNode | void;
    nextArrow: (args: {
      loop: boolean;
      handleNext: () => void;
      activeIndex: number;
      lastIndex: boolean;
    }) => React.ReactNode | void;
    navigation: (args: {
      setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
      activeIndex: number;
      length: number;
    }) => React.ReactNode | void;
    transition: object;
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    className: string;
    activeIndex: number;
  };
  styles: {
    base: {
      carousel: object;
      slide: object;
    };
  };
}
export default function ProductImageCarousel({ image }: { image: string[] }) {
  return (
    <Carousel
      className="w-10/12 sm:w-3/4 lg:w-1/2 mx-auto  rounded-md h-96 relative"
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
      {image.length != 0 ? (
        image.map((item, index) => {
          return (
            <img
              src={item}
              alt="image 1"
              className=" object-cover  ease-in-out h-96 mx-auto"
              key={index}
            />
          );
        })
      ) : (
        <div className=" object-cover  ease-in-out h-96 mx-auto bg-white" />
      )}
    </Carousel>
  );
}
