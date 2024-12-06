import React, { useMemo } from "react";
import { ITextProps } from "../types/component";

const Text = (props: ITextProps) => {
  const { children, type, className, onClick } = props;

  const textClass = useMemo(() => {
    switch (type) {
      case "CAPTION4": {
        return "text-[12px] leading-[16px]";
      }
      case "CAPTION3": {
        return "text-[12px] leading-[16px] font-medium";
      }
      case "CAPTION2": {
        return "text-[13px] leading-[16px]";
      }
      case "CAPTION1": {
        return "text-[14px] leading-[22px] font-medium";
      }
      case "BODY": {
        return "text-[15px] leading-[23px]";
      }
      case "HEADLINE": {
        return "text-[15px] leading-[23px] font-medium";
      }
      case "TITLE4": {
        return "text-[16px] leading-[26px]";
      }
      case "TITLE3": {
        return "text-[18px] leading-[26px] font-medium";
      }
      case "TITLE2": {
        return "text-[26px] leading-[34px] font-semibold";
      }
      case "TITLE1": {
        return "text-[30px] leading-[38px] font-semibold";
      }
      case "H3": {
        return "text-[32px] leading-[110%] font-semibold";
      }
      case "H2": {
        return "text-[36px] leading-[110%] font-semibold";
      }
      case "H1": {
        return "text-[42px] leading-[110%] font-bold";
      }
      default: {
        return "text-[15px] leading-[23px]";
      }
    }
  }, [type]);

  return (
    <div onClick={onClick && onClick} className="bg-transparent">
      <p className={`${textClass} ${className && className} !bg-transparent`}>{children}</p>
    </div>
  );
};

export default React.memo(Text);
