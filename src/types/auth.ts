import { IUser } from "@/models/user";

export interface BodySaleLogin {
  username: string;

  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: IUser;
}
