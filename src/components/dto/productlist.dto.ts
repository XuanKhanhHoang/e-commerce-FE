type productOfProductList = {
  original_price: number;
  price_sell: number;
  discount: number;
  name: string;
  product_id: number;
  logo: string;
  brand: {
    id: number;
    name: string;
  };
  rating: number;
};
type getProductListResponse = {
  totalPage: number;
  data: productList;
  categoryName: string;
};
type productList = productOfProductList[];
