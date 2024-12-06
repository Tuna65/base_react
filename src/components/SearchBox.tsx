import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { useLayoutEffect, useRef, useState } from "react";

type Props = {
  onChange: (value: string) => void;
  value: string;
  className?: string;
  placeholder?: string;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
};

const SearchBox = (props: Props) => {
  const { onChange, value, className, placeholder, onBlur, onKeyDown, id } =
    props;
  const [currentValue, setCurrentValue] = useState<string>(value);
  const timeoutRef = useRef(null);

  const handleSetQuery = () => (e: any) => {
    const value = e.target.value;
    setCurrentValue(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    //@ts-ignore
    timeoutRef.current = setTimeout(() => {
      onChange(value);
    }, 300);
  };

  useLayoutEffect(() => {
    if (!value) setCurrentValue("");
    else setCurrentValue(value);
  }, [value]);
  return (
    <div>
      <div className="">
        <Input
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          maxLength={255}
          autoFocus
          id={id}
          className={`search-box ${className}`}
          placeholder={placeholder ?? "Tìm kiếm..."}
          onChange={handleSetQuery()}
          value={currentValue}
          prefix={
            <div className="pr-2">
              <SearchOutlined />
            </div>
          }
          size="large"
        />
      </div>
    </div>
  );
};

export default React.memo(SearchBox);
