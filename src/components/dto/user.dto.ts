export type userGeneral = {
  user_id: number;
  first_name: string;
  avatar: string | undefined;
  ROLE: string;
};
export interface UserFullDetailAndOrder {
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  gender: boolean;
  avartar: string;
  login_name: string;
  phone_number: string;
  orders: Order[];
}

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
