import { EStatus } from "@/enum/EStatus";
import { IBaseEntity } from ".";
import { IRole } from "./role";

export interface IUser extends IBaseEntity {
  name: string;

  username: string;

  password: string;

  email: string;

  phone: string;

  shopId: string;

  image: string;

  role?: IRole;

  roleId?: string;

  isOwner: boolean;

  city: boolean;

  district: boolean;

  ward: boolean;

  address: boolean;

  status: EStatus | boolean;

  gender: string;
}
