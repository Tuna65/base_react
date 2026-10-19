import { forwardRef } from "react";
import { Button as AntButton } from "antd";
import type { ButtonProps } from "antd";
import type { ComponentRef } from "react";

const Button = forwardRef<ComponentRef<typeof AntButton>, ButtonProps>((props, ref) => (
  <AntButton {...props} ref={ref} />
));
Button.displayName = "Button";

export type { ButtonProps };
export default Button;
