import { Modal as ModalAntd, ModalProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { VoidFunc } from '../models';

type Props = {
  off: VoidFunc;
  modalProps: ModalProps;
  open?: boolean;
  children?: React.ReactNode;
  isLoading?: boolean;
};
const Modal = (props: Props) => {
  const { t } = useTranslation();
  const { off, modalProps, open, children, isLoading } = props;
  const [form] = useForm();

  const DefaultButtonProps = { className: 'rounded-[8px]  px-4 h-11' };

  const DefaultPropModal: ModalProps = {
    centered: true,
    width: 600,
    closable: true,
    okText: <span className="text-sm">{t('confirm')}</span>,
    cancelText: <span className="text-sm">{t('cancel')}</span>,
    onCancel: off,
    cancelButtonProps: DefaultButtonProps,
    okButtonProps: DefaultButtonProps,
  };
  return (
    <div>
      <ModalAntd
        open={true}
        onOk={form.submit}
        onCancel={() => {
          off();
          form.resetFields();
        }}
        {...DefaultPropModal}
        {...modalProps}
        confirmLoading={isLoading}
      >
        {children}
      </ModalAntd>
    </div>
  );
};

export default React.memo(Modal);
