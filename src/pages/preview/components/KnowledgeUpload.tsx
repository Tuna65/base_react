import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";

type KnowledgeUploadProps = {
  loading: boolean;
  onUpload: (file: File) => void;
};

const KnowledgeUpload = ({ loading, onUpload }: KnowledgeUploadProps) => (
  <Upload
    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    multiple={false}
    showUploadList={false}
    disabled={loading}
    beforeUpload={(file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension !== "pdf" && extension !== "docx") {
        message.error("Vui lòng chọn file PDF hoặc DOCX");
        return Upload.LIST_IGNORE;
      }

      onUpload(file as File);
      return false;
    }}
  >
    <Button
      icon={<UploadOutlined />}
      loading={loading}
      className="!h-9 !rounded-md !border-[#cbd5e1] !px-4 !text-[14px] !font-semibold !text-[#071b3b] !shadow-sm"
    >
      Upload document
    </Button>
  </Upload>
);

export default KnowledgeUpload;
