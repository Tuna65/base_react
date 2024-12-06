import { VoidFunc } from "@/models";

export interface ITextProps {
  onClick?: VoidFunc;
  className?: string;
  children: any;
  type?:
    | "CAPTION4"
    | "CAPTION3"
    | "CAPTION2"
    | "CAPTION1"
    | "BODY"
    | "HEADLINE"
    | "TITLE1"
    | "TITLE2"
    | "TITLE3"
    | "TITLE4"
    | "H3"
    | "H2"
    | "H1";
}
