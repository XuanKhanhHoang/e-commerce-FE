export interface Order {
  createAt: string;
  status: {
    id: number;
    status_name: string;
  };
  order_list: OrderList[];
  price: number;
  name: string;
  id: number;
}

export interface OrderList {
  amount: number;
  id: number;
  discount: number;
  price: number;
  option: {
    name: string;
    products: {
      name: string;
    };
  };
}
export type createOrderItem = {
  option_id: number;
  amount: number;
};

export type orderResponse = { totalPage: number; value: Order[] };
