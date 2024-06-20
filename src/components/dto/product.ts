export interface CreateOrderProduct {
  id: number;
  name: string;
  discount: number;
  amount: number;
  products: {
    name: string;
  };
  image: string;
  selling_price: number;
  original_price: number;
}
export type CreateOrderProductAndAmount = CreateOrderProduct & {
  amount: number;
};
