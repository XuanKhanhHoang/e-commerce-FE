import ProductInfo from "@/components/product/product_detail.tsx/product_detail";
import fetch from "@/utils/fetch";
import { notFound, redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: {
    product_id: string;
  };
}) {
  const product_id = params.product_id;
  if (!product_id) return redirect("/productlist");
  if (isNaN(Number(product_id))) return notFound();
  let res: Response = await fetch(
    "/product/productdetail?product_id=" + product_id
  );
  let productDetail: product_detail | undefined = res.ok
    ? await res.json()
    : undefined;
  if (productDetail == undefined) return notFound();
  return <ProductInfo productDetail={productDetail} />;
}
