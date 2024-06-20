import FlashsaleComponents from "@/components/homepage/flashsale";
import ProductListLimitedOverviewForAnType from "@/components/layout/productlist_limited_overview_for_an_type/productlist_limited_overview_for_an_type";
import WebBanner from "@/components/homepage/webBanner";
import { AllProduct } from "@/components/homepage/allProduct";
export default function Home({
  searchParams,
}: {
  searchParams: { page: string | undefined };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center px-2">
      <WebBanner />
      <FlashsaleComponents productList={[]} />
      <ProductListLimitedOverviewForAnType
        typeName="Sản phẩm mới"
        href="/productlist"
      />
      <ProductListLimitedOverviewForAnType
        typeName="Sản phẩm bán chạy "
        href="/productlist"
        decoratorWidth={20}
      />
      <ProductListLimitedOverviewForAnType
        typeName="Điện thoại "
        href="/productlist?categoty_id=1"
      />
      <ProductListLimitedOverviewForAnType
        typeName="Tablet"
        category_id={2}
        href="/productlist?category_id=2"
      />
      <AllProduct />
    </main>
  );
}
