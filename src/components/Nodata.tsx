import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  text?: string;
};

const Nodata = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="p-12">
        <div className="">
          <div className="text-gray-700">
            {/* <IConNodata /> */}
          </div>
          <p className="text-gray-700">{t(props.text ?? 'No Data')}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Nodata);
