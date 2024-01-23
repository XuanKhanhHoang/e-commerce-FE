import FlashsaleComponents from "@/components/homepage/flashsale";
import Pagination from "@/components/layout/pagination/pagination";
import RenderProductList from "@/components/product/productlist/productlist";
import fetch from "@/utils/fetch";
import ProductListLimitedOverviewForAnType from "@/components/layout/productlist_limited_overview_for_an_type/productlist_limited_overview_for_an_type";
import PromotionBannerCarousel from "@/components/homepage/promotionBannerCarousel";
export default async function Home({
  searchParams,
}: {
  searchParams: { page: string | undefined };
}) {
  let page = searchParams.page || 1;
  let productlist: productList = [];
  let totalPage = 0;
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
    <main className="flex min-h-screen flex-col items-center px-2">
      <PromotionBannerCarousel bannerList={bannerCarousel} />
      <div className="flex no-scrollbar overflow-scroll w-full mt-2">
        {bannerStatic.length != 0 &&
          bannerStatic.map((item) => {
            return (
              <div
                className="px-2 flex-none w-1/2 md:w-1/3 lg:w-1/4 max-w-[300px] mx-auto"
                key={item.id}
              >
                <img src={item.image} alt="" className="w-full" />
              </div>
            );
          })}
      </div>
      <FlashsaleComponents productList={productlist} />
      <ProductListLimitedOverviewForAnType
        typeName="Sản phẩm mới"
        href="/productlist"
      />
      <ProductListLimitedOverviewForAnType
        typeName="Sản phẩm bán chạy "
        href="/"
      />
      <ProductListLimitedOverviewForAnType
        typeName="Điện thoại "
        href="/productlist?categoty_id=1"
      />
      <ProductListLimitedOverviewForAnType
        typeName="Máy tính "
        href="/productlist?category_id=1"
      />

      <div className="w-full">
        <div className="flex justify-between w-full my-8  items-center ">
          <div className=" relative text-base ms-10 h-fit text-white bg-main rounded-sm py-1 w-full  md:w-64 lg:w-72 uppercase font-medium text-center text-nowrap">
            Sản phẩm:
            <div
              className=" absolute z-10 w-0 h-0 top-0 left-[-40px]"
              style={{
                height: 0,
                borderLeft: "30px solid #009981",
                borderRight: "40px solid #00483d",
                borderBottom: "32px solid #009981",
              }}
            ></div>
          </div>
        </div>
        <RenderProductList productlist={productlist} />
      </div>
      <Pagination itemsPerPage={14} totalPage={totalPage} rootDirection={"/"} />
    </main>
  );
}
