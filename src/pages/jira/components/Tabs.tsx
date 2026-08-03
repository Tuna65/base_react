import {
  FileTextOutlined,
  HistoryOutlined,
  PartitionOutlined,
  ProfileOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Segmented, Tag } from "antd";
import { getStringValue } from "../helper";

export type RequirementSection = "overview" | "test-design";

type TabsProps = {
  detailData: Record<string, unknown>;
  active: RequirementSection;
  onChange: (section: RequirementSection) => void;
};

export default function Tabs({ detailData, active, onChange }: TabsProps) {
  const issueKey = getStringValue(detailData.key) || "---";
  const requirementId = getStringValue(detailData.requirementId || detailData.requirement_id) || "---";
  const issueType = getStringValue(detailData.issueType || detailData.issuetype) || "Task";
  const sprint = getStringValue(detailData.sprint) || "TES Sprint 4";
  const lastSync = getStringValue(detailData.updated || detailData.updatedAt) || "---";
  return (
    <div className=" text-[#1a2638]">
      <div className="px-6 pb-4 pt-3">
        <div className="mb-2 flex gap-2 text-[12px] text-[#4f7fb8]">
          <span>{issueKey} ↗</span>
          <span>•</span>
          <span>{requirementId}</span>
          <Tag className="!m-0 !border-blue-200 !bg-blue-50 !text-[#4f7fb8]">{issueType}</Tag>
        </div>
        <h2 className="m-0 text-[18px] font-bold">{getStringValue(detailData.summary) || "Untitled requirement"}</h2>
        <div className="mt-2 text-[12px] text-[#66758d]">
          {sprint} • Last sync {lastSync}
        </div>
      </div>
      <div className=" px-6 py-2">
        <Segmented
          value={active}
          size="small"
          onChange={(value) => onChange(value as RequirementSection)}
          options={[
            {
              value: "overview",
              label: (
                <span className="flex items-center gap-1.5">
                  <FileTextOutlined /> Overview
                </span>
              ),
            },
            {
              value: "sub-tasks",
              label: (
                <span className="flex items-center gap-1.5">
                  <UnorderedListOutlined /> Sub-tasks
                </span>
              ),
              disabled: true,
            },
            {
              value: "test-design",
              label: (
                <span className="flex items-center gap-1.5">
                  <PartitionOutlined /> Test Design
                </span>
              ),
            },
            {
              value: "test-cases",
              label: (
                <span className="flex items-center gap-1.5">
                  <ProfileOutlined /> Test Cases (0)
                </span>
              ),
              disabled: true,
            },
            {
              value: "versions",
              label: (
                <span className="flex items-center gap-1.5">
                  <HistoryOutlined /> Versions
                </span>
              ),
              disabled: true,
            },
          ]}
          className="!rounded-lg !bg-[#f4f7fb] !p-1 [&_.ant-segmented-item]:!rounded-md [&_.ant-segmented-item]:!px-3 [&_.ant-segmented-item]:!py-1.5 [&_.ant-segmented-item-label]:!min-h-0 [&_.ant-segmented-item-label]:!text-[13px] [&_.ant-segmented-item-label]:!font-semibold [&_.ant-segmented-item-selected]:!bg-white [&_.ant-segmented-item-selected]:!text-[#4f7fb8] [&_.ant-segmented-item-selected]:!shadow-sm"
        />
      </div>
    </div>
  );
}
