import React from 'react';
import { Button as ButtonAnt } from 'antd';
import { ButtonShape, ButtonType } from 'antd/es/button';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { VoidFunc } from '../models';

type Props = {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: SizeType;
  disabled?: boolean;
  loading?:
    | boolean
    | {
        delay?: number;
      };
  prefixCls?: string;
  className?: string;
  onClick?: VoidFunc;
  rootClassName?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
  [key: `data-${string}`]: string;
  classNames?: {
    icon: string;
  };
  styles?: {
    icon: React.CSSProperties;
  };
};

const Button = (props: Props) => {
  return (
    <div>
      <ButtonAnt {...props} onClick={props.onClick}>
        <div className="flex items-center gap-[4px]">{props.children}</div>
      </ButtonAnt>
    </div>
  );
};

export default React.memo(Button);
