export type userGeneral = {
  user_id: number;
  first_name: string;
  avatar: string | undefined;
  ROLE: string;
};
export interface UserFullDetail {
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  gender: boolean;
  avartar: string;
  login_name: string;
  phone_number: string;
}
export type UserCreateOrderDTO = {
  recipient_name: string;
  address: string;
  phone_number: string;
};
