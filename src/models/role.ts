import { IBaseEntity } from ".";

export interface IRole extends IBaseEntity {
  permission: string[];

  name: string;

  description: string;

  shopId: string;
}
