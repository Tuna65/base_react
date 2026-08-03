import { FileTextOutlined } from "@ant-design/icons";
import { Drawer, Tag, Typography } from "antd";
import { MarkdownHeading, MarkdownPage } from "../helper";
import KnowledgeDetailContent from "./KnowledgeDetailContent";

const { Text } = Typography;

type KnowledgeDrawerProps = {
  open: boolean;
  loading: boolean;
  fileName: string;
  issueKey: string;
  markdown: string;
  markdownPages: MarkdownPage[];
  headings: MarkdownHeading[];
  selectedHeadingIndex: number | null;
  onClose: () => void;
  onSelectedHeadingChange: (index: number | null) => void;
};

export default function KnowledgeDrawer({
  open,
  loading,
  fileName,
  issueKey,
  markdown,
  markdownPages,
  headings,
  selectedHeadingIndex,
  onClose,
  onSelectedHeadingChange,
}: KnowledgeDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="min(1180px, 92vw)"
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-primary" />
          <Text strong ellipsis>{fileName || "Chi tiết tài liệu OCR"}</Text>
          {issueKey && <Tag color="blue" className="ml-2">{issueKey}</Tag>}
        </div>
      }
    >
      <KnowledgeDetailContent
        loading={loading}
        markdown={markdown}
        markdownPages={markdownPages}
        headings={headings}
        selectedHeadingIndex={selectedHeadingIndex}
        onSelectedHeadingChange={onSelectedHeadingChange}
      />
    </Drawer>
  );
}
