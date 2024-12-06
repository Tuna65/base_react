import { func } from "@/utils/func";
import React from "react";

type Props = {
  onChange?: (value: number) => void;
  value?: number;
  className?: string;
};

const InputLine = (props: Props) => {
  const { value, onChange, className } = props;

  return (
    <input
      onChange={(e) => {
        const quantity = e.target.value;
        onChange && onChange(Number(quantity.replace(/,/g, "")));
      }}
      onFocus={(e) => e.target.select()}
      value={func.numberWithDots(value ?? 0)}
      className={`${
        className && className
      } w-full text-center bg-transparent py-1 border-0 border-b border-solid border-black border-opacity-20`}
    />
  );
};

export default React.memo(InputLine);
