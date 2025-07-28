// import { ResPagination, SuccessFunc } from "@/models";
// import { IParamQuery } from "@/types";
// import { defaultResPage } from "@/utils";
// import { DownOutlined, SearchOutlined } from "@ant-design/icons";
// import { Flex, Input, Popover } from "antd";
// import { cloneDeep } from "lodash";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import Text from "./Text";

// type IInfinityScrollProps = {
//   value?: string;
//   onChange?: SuccessFunc<string>;
//   keyValue: string;
//   apiFunc: any;
//   placeholder?: string;
//   className?: string;
//   width?: number;
// };

// const InfinityScroll = (props: IInfinityScrollProps) => {
//   const { value, onChange, keyValue, apiFunc, placeholder, className, width } = props;
//   const timeoutRef = useRef(null);
//   const { t } = useTranslation();

//   const [currentValue, setCurrentValue] = useState<string>("");
//   const [params, setParams] = useState<IParamQuery>({ page: 1, limit: 20, name: "" });
//   const [items, setItems] = useState<ResPagination<any>>(defaultResPage);

//   const handleSetQuery = () => (e: any) => {
//     const value = e.target.value;
//     setCurrentValue(value);
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     //@ts-ignore
//     timeoutRef.current = setTimeout(() => {
//       setParams((prev) => ({ ...prev, name: value, page: 1 }));
//     }, 500);
//   };

//   const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
//     const { target } = e;
//     //@ts-ignore
//     const { scrollTop, scrollHeight, clientHeight } = target;
//     if (scrollTop + clientHeight >= scrollHeight) {
//       const cloneData: ResPagination<any> = cloneDeep(data as any);
//       if (cloneData.meta.totalPages > Number(params.page)) {
//         setParams((prev) => ({ ...prev, page: Number(prev.page) + 1 }));
//       }
//     }
//   };

//   const content = useMemo(() => {
//     return (
//       <Flex vertical className={`!w-[250px] max-h-[260px] overflow-y-auto overflow-x-hidden`} onScroll={handleScroll}>
//         {items?.items?.map((o) => (
//           <div className="p-2 cursor-pointer hover:bg-gray-100 w-full" key={`${o?.id}`}>
//             <Text
//               type="BODY"
//               className="hover:bg-gray-100 text-truncate-oneline"
//               onClick={() => {
//                 setCurrentValue(o.name);
//                 onChange && onChange(o.id);
//               }}
//             >
//               {o?.name}
//             </Text>
//           </div>
//         ))}

//         {isLoading && <Text type="BODY">{t("Loading...")}</Text>}
//       </Flex>
//     );
//   }, [items.items.length, width]);

//   useEffect(() => {
//     if (data)
//       if (Number(params.page) > 1) {
//         //@ts-ignore
//         setItems((prev) => ({ ...prev, items: [...prev.items, ...data?.items] }));
//         //@ts-ignore
//       } else setItems(data);
//   }, [data]);

//   useEffect(() => {
//     if (value) {
//       const v = items.items.find((i) => i.id == value);
//       if (v) setCurrentValue(v.name);
//       else setCurrentValue(value);
//     }
//   }, [value, items]);
//   return (
//     <Flex vertical className="w-full">
//       <Popover rootClassName="popover-infinity " content={content} placement="bottomLeft" arrow={false}>
//         <Input
//           prefix={<SearchOutlined />}
//           className={className}
//           placeholder={placeholder}
//           onChange={handleSetQuery()}
//           suffix={<DownOutlined />}
//           value={currentValue}
//         />
//       </Popover>
//     </Flex>
//   );
// };

// export default React.memo(InfinityScroll);
