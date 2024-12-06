import React from "react";

export type TRouterList = {
  path: string;
  component: any;
};

export type Option = {
  label: string | React.ReactNode;
  value: string | number;
};

export interface IMetaData {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export declare class ResPagination<PaginationObject> {
  readonly items: PaginationObject[];
  readonly meta: IMetaData;

  constructor(items: PaginationObject[], meta: IMetaData);
}

export type VoidFunc = () => void;

export type SuccessFunc<T> = (value: T) => void;

export interface IBaseEntity {
  id?: string;
  createdAt?: string;
  updateAt?: string;
  createdBy?: string;
}
