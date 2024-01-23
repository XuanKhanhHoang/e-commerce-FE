"use client";

import ProductComment from "./product_comment";
import ProductDescription from "./product_description";
import ProductImageCarousel from "./product_image_carousel";
import ProductOptions from "./product_options";

export default function ProductDetail({
  productDetail,
}: {
  productDetail: product_detail | undefined;
}) {
  if (!productDetail)
    return (
      <div>
        <h3 className="text-center text-3xl mx-auto block">
          Có lỗi khi tải thông tin sản phẩm
        </h3>
      </div>
    );
  const {
    brand,
    description,
    infomation,
    name,
    product_id,
    product_options,
    rating,
  } = productDetail;
  const image: string[] = product_options.map((item) => {
    return item.image;
  });
  return (
    <>
      {/* content */}
      <section className="py-5">
        <div className="container mx-auto sm:px-4">
          <div className="flex flex-wrap  gx-5">
            <ProductImageCarousel image={image} />
            <main className="w-full lg:w-1/2 pr-4 pl-4 bg-white p-2 rounded py-3">
              <div className="lg:ps-4">
                <h4 className="title text-gray-900 font-bold">{name}</h4>
                <div className="flex flex-row my-3">
                  <div className="text-yellow-500 mb-1 me-2">
                    {[...Array(Math.floor(rating))].map((item, index) => {
                      return <i className="fa fa-star" key={index} />;
                    })}

                    <span className="ms-1">{rating}</span>
                  </div>
                  <span className="text-gray-700">
                    <i className="fas fa-shopping-basket fa-sm mx-1" />
                    154 orders
                  </span>
                  <span className="text-green-500 ms-2">In stock</span>
                </div>
                <ProductOptions
                  productId={product_id}
                  productOptions={product_options}
                />
              </div>
            </main>
          </div>
        </div>
      </section>
      {/* content */}
      <section className="bg-gray-100 border-t py-4">
        <div className="container mx-auto sm:px-4">
          <div className="flex flex-wrap  ">
            <ProductDescription
              productDescription={description}
              productInfomation={infomation}
            />
            <div className="w-full lg:w-1/3 pr-4 pl-4">
              <div className="px-0 border rounded-2 shadow-0">
                <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300">
                  <h5 className="mb-3 ms-6">Similar items</h5>

                  <div className="flex flex-row p-6 flex-wrap ">
                    {[1, 2, 3, 4].map((item) => {
                      return (
                        <div className="flex mb-3 w-1/2 lg:w-full" key={item}>
                          <a href="#" className="me-3">
                            <img
                              src="/apple-iphone-12-mini.webp"
                              style={{ minWidth: 96, height: 96 }}
                              className="img-md max-w-full h-auto border-1 border-gray-200 rounded p-1"
                            />
                          </a>
                          <div className="info">
                            <a
                              href="#"
                              className="inline-block py-2 px-4 no-underline mb-1"
                            >
                              Rucksack Backpack Large <br />
                              Line Mounts
                            </a>
                            <strong className="text-gray-900"> $38.90</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductComment commentsProps={productDetail.comment} rating={rating} />
    </>
  );
}
