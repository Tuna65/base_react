import { Modal, ModalProps } from 'antd';
import React from 'react';
import { VoidFunc } from '../models';
import { useTranslation } from 'react-i18next';

type Props = {
  off: VoidFunc;
  modalProps: ModalProps;
};

const DeleteModal = (props: Props) => {
  const { off, modalProps } = props;
  const { t } = useTranslation();

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
      <Modal
        {...DefaultPropModal}
        {...modalProps}
        title={<span className="font-semibold text-xl">{modalProps.title}</span>}
      />
    </div>
  );
};

export default React.memo(DeleteModal);
