import { IUser } from "@/models/user";

export interface BodySaleLogin {
  username: string;

  password: string;
}

export interface LoginResponse {
  token: string;
  rf_token: string;
  access_token?: string;
  refresh_token?: string;
  expires_in: number;
  user: IUser;
}
