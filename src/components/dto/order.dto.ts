export type Order = {
  createAt: string;
  status: {
    id: number;
    status_name: string;
  };
  id: number;
  order_list: {
    amount: number;
    id: number;
    discount: number;
    price: number;
    option: {
      name: string;
      products: {
        name: string;
      };
      image: string;
    };
  }[];
  payment_method: {
    id: number;
    name: string;
  };
  receivedAt: string | null;
  recipient_name: string;
  phone_number: string;
  value: number;
  name: string | null;
  deliver_fee: number;
};
export type OrderFullInfo = {
  createAt: string;
  status: {
    id: number;
    status_name: string;
  };
  id: number;
  order_list: {
    amount: number;
    id: number;
    discount: number;
    price: number;
    option: {
      name: string;
      products: {
        name: string;
      };
      image: string;
    };
  }[];
  payment_method: {
    id: number;
    name: string;
  };
  receivedAt: string | null;
  recipient_name: string;
  phone_number: string;
  value: number;
  name: string | null;
  deliver_fee: number;
  delivery_address: string;
};
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
