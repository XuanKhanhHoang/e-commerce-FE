type product_detail = {
  logo: string;
  name: string;
  description: string;
  product_id: number;
  infomation: string;
  rating: number;
  product_options: product_options[];
  brand: {
    id: number;
    name: string;
  };
  comment: comment[];
};
type product_options = {
  original_price: number;
  selling_price: number;
  name: string;
  id: number;
  amount: number;
  discount: number;
  image: string;
};
type comment = {
  id: number;
  content: string;
  rating: number;
  user: {
    user_id: number;
    avartar: string;
    first_name: string;
  };
  seller_reply: string;
  createAt: string;
  image: {
    image: string;
  }[];
};
