import truncateText from "@/utils/truncateText";
import Link from "next/link";
import RatingComponents from "../layout/rating/rating";
import formatPrice from "@/utils/formatPrice";

export default function ProductReviewCard({
  productInfo,
}: {
  productInfo: productOfProductList;
}) {
  return (
    <Link
      href={"/product/" + productInfo.product_id}
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
      <div></div>
      <hr className="h-[1px] mt-2" />
      <div className="p-2  ">
        <div className="flex items-center gap-2 font-bold text-blue-gray-500 text-sm justify-center">
          {productInfo.rating}
          <RatingComponents
            value={productInfo.rating}
            classIcon={"h-3 w-3 md:h-5 w-5"}
          />
        </div>
        <p className="my-2 md:text-base font-bold tracking-tight text-gray-900  text-sm text-center text-wrap">
          {truncateText(productInfo.name)}
        </p>
        <div className="flex flex-wrap items-center justify-evenly flex-col">
          <span className="font-semibold text-red-500 text-lg">
            {formatPrice(productInfo.price_sell)} đ
          </span>
          <span
            className={
              "line-through text-sm opacity-70 " +
              (productInfo.discount == 0 && "invisible")
            }
          >
            {formatPrice(productInfo.original_price)} đ
          </span>
        </div>
      </div>
    </Link>
  );
}
