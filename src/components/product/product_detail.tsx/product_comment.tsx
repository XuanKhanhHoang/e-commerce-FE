"use client";
import { useState } from "react";
import ProductImageCommentImage from "./product_comment_image";
import formatTime from "@/utils/formatTime";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import RatingComponents from "@/components/layout/rating/rating";

export default function ProductComment({
  commentsProps,
  rating,
}: {
  commentsProps: comment[];
  rating: number;
}) {
  const [comments, setComments] = useState(commentsProps);
  const [filterNumber, setFilterNumber] = useState("6");
  let s5: number = 0;
  let s4: number = 0;
  let s3: number = 0;
  let s2: number = 0;
  let s1: number = 0;
  if (commentsProps.length != 0)
    commentsProps.map((item) => {
      switch (item.rating) {
        case 5: {
          s5++;
          break;
        }
        case 4: {
          s4++;
          break;
        }
        case 3: {
          s3++;
          break;
        }
        case 2: {
          s2++;
          break;
        }
        case 1: {
          s1++;
          break;
        }
      }
    });
  const filterComments = (star: number) => {
    setFilterNumber(star.toString());
    if (star == 6) {
      setComments(commentsProps);
      return;
    }
    setComments(commentsProps.filter((item) => item.rating == star));
  };
  return (
    <section className="bg-white m-2 p-3 lg:p-6 antialiased ">
      <h3 className="text-lg uppercase font-medium py-2">
        {" "}
        Đánh giá sản phẩm{" "}
      </h3>
      <div className="p-5 border border-main flex rounded text-red-500">
        <div className="flex flex-col min-w-36">
          <h3 className="text-4xl text-red-500 px-3 py-2 block text-center">
            {rating} <span className="text-base font-semibold">trên 5</span>
          </h3>
          <div className="mx-auto">
            <RatingComponents value={rating} />
          </div>
        </div>
        <div className="flex-wrap items-center hidden md:flex text-black">
          <button
            className={
              "border p-3 rounded-sm mx-2 mb-2 text-sm" +
              (filterNumber == "6" ? " border-main" : "")
            }
            onClick={() => filterComments(6)}
          >
            Tất cả
          </button>
          <button
            className={
              "border p-3 rounded-sm mx-2 mb-2 text-sm" +
              (filterNumber == "5" ? " border-main" : "")
            }
            onClick={() => filterComments(5)}
          >
            5 sao ({s5} đánh giá)
          </button>
          <button
            className={
              "border p-3 rounded-sm mx-2 mb-2 text-sm" +
              (filterNumber == "4" ? " border-main" : "")
            }
            onClick={() => filterComments(4)}
          >
            4 sao ({s4} đánh giá)
          </button>
          <button
            className={
              "border p-3 rounded-sm mx-2 mb-2 text-sm" +
              (filterNumber == "3" ? " border-main" : "")
            }
            onClick={() => filterComments(3)}
          >
            3 sao ({s3} đánh giá)
          </button>
          <button
            className={
              "border p-3 rounded-sm mx-2 mb-2 text-sm" +
              (filterNumber == "2" ? " border-main" : "")
            }
            onClick={() => filterComments(2)}
          >
            2 sao ({s2} đánh giá)
          </button>
          <button
            className={
              "border p-3 rounded-sm mx-2 mb-2 text-sm" +
              (filterNumber == "1" ? " border-main" : "")
            }
            onClick={() => filterComments(1)}
          >
            1 sao ({s1} đánh giá)
          </button>
        </div>
        <select
          name=""
          id=""
          onChange={(e) => {
            filterComments(Number(e.currentTarget.value));
          }}
          value={filterNumber}
          className="bg-gray-50 h-11 my-auto md:hidden border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="6"> Tất cả</option>
          <option value="5"> 5 sao ({s5} đánh giá)</option>
          <option value="4"> 4 sao ({s4} đánh giá)</option>
          <option value="3"> 3 sao ({s3} đánh giá)</option>
          <option value="2"> 2 sao ({s2} đánh giá)</option>
          <option value="1"> 1 sao ({s1} đánh giá)</option>
        </select>
      </div>
      <div className="w-full px-4">
        {comments.length != 0 ? (
          comments.map((item) => {
            return (
              <div key={item.id}>
                <article className="p-6 pb-3 text-base bg-white rounded-lg dark:bg-gray-900 ">
                  <div className="flex">
                    {" "}
                    <img
                      className="mr-2 w-8 h-8 rounded-full"
                      src={getWebViewLinkFromWebContentLink(item.user.avartar)}
                    />
                    <div className="">
                      <footer className="flex justify-between items-center mb-2 flex-wrap">
                        <div className="flex items-center">
                          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                            {item.user.first_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <time
                              dateTime="2022-02-08"
                              title="February 8th, 2022"
                            >
                              {formatTime(item.createAt)}
                            </time>
                          </p>
                        </div>
                        <div className="text- w-full">
                          <RatingComponents
                            value={item.rating}
                            classIcon="w-4 h-4"
                          />
                        </div>
                      </footer>
                      <p className="text-gray-500 dark:text-gray-400">
                        {item.content}
                      </p>
                    </div>
                  </div>
                  <ProductImageCommentImage imageArray={item.image} />
                </article>
                {item.seller_reply && (
                  <article className="p-6 pt-2 pr-2 mb-3 ml-6 lg:ml-12 text-base bg-gray-100 rounded-lg dark:bg-gray-900">
                    <footer className="flex justify-between items-center mb-2">
                      <div className="flex items-center flex-wrap">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                          <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                            alt="Jese Leos"
                          />
                          Phản hồi từ nhà bán hàng
                        </p>
                        <p className="text-sm ms-6 text-gray-600 dark:text-gray-400">
                          {item.seller_replyAt
                            ? formatTime(item.seller_replyAt)
                            : "Có lỗi xảy ra"}
                        </p>
                      </div>
                    </footer>
                    <p className="text-gray-500 dark:text-gray-400">
                      {item.seller_reply}
                    </p>
                  </article>
                )}
                <hr />
              </div>
            );
          })
        ) : (
          <div className="text-xl py-4  text-center">
            <img src="/nonstar.png" alt="" className="block mx-auto p-4" />
            Chưa có đánh giá nào
          </div>
        )}
      </div>
    </section>
  );
}
