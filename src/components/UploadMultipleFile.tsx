import { GetProp, Upload, UploadFile, UploadProps, message } from "antd";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { IGallery } from "@/models/gallery";
import { galleryAPI } from "@/apis/upload";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type Props = {
  onChange?: (url: string[]) => void;
  initLink?: string[];
  hiddenText?: boolean;
};

const UploadMultipleFile = (props: Props) => {
  const { onChange, initLink, hiddenText } = props;
  const { t } = useTranslation();

  const [link, setLink] = useState<UploadFile[]>(
    (initLink ?? [])?.map((url) => ({ uid: `link-default`, name: "res.name", status: "done", url }))
  );

  useEffect(() => {
    initLink && (initLink ?? [])?.map((url) => ({ uid: `link-default`, name: "res.name", status: "done", url }));
    !initLink && setLink([]);
  }, [initLink]);

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";

    if (!isJpgOrPng) {
      return message.error(t("You can only upload JPG/PNG file!"));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleUpload = async (file: any) => {
    try {
      const res: IGallery = await galleryAPI.upload({ file });
      if (res) {
        const oldList = link.map((l) => l?.url ?? "");
        onChange && onChange([...oldList, res.url]);
        setLink([...link, { uid: res.id, name: res.name, status: "done", url: `${res.url}` }]);
      }
    } catch (error) {}
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.fileList.length != 0) handleUpload(info.file.originFileObj);
    else setLink([]);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <div className="flex items-center gap-4 flex-col upload-single">
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={[]}
        onPreview={onPreview}
        onChange={handleChange}
        // beforeUpload={beforeUpload}
        beforeUpload={beforeUpload as any}
        // openFileDialogOnClick={false}
      >
        <button style={{ border: 0, background: "none" }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </button>
      </Upload>
      {!hiddenText && (
        <div className="flex flex-col mb-6 font-semibold items-center gap-2">
          <h6 className="text-md leading-sm text-gray-700">{t("Upload a photo")}</h6>
          <p className="text-sm leading-sm text-gray-400">(Recommend JPEG, PNG. Maximum 1MB)</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(UploadMultipleFile);
