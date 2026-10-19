import { forwardRef } from "react";
import type { ComponentRef } from "react";
import Button, { ButtonProps } from "./Button";

type IconButtonProps = Omit<ButtonProps, "aria-label"> & { "aria-label": string };

const IconButton = forwardRef<ComponentRef<typeof Button>, IconButtonProps>(({ className = "", ...props }, ref) => (
  <Button {...props} ref={ref} type="text" className={`!inline-flex !h-9 !w-9 !shrink-0 !items-center !justify-center !rounded-[9px] !border !border-solid !border-[#e7e5ee] !bg-transparent !p-0 !text-[#252331] !shadow-none hover:!bg-[#f2effa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a89af7] dark:!border-[#27252e] dark:!text-[#eeedf5] dark:hover:!bg-[#1b1923] [&_.anticon]:!text-base ${className}`} />
));
IconButton.displayName = "IconButton";

export default IconButton;
