import { Drawer, Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import Overview from "./Overview";
import TestDesign from "./TestDesign";
import Tabs, { RequirementSection } from "./Tabs";

type RequirementDrawerProps = {
  open: boolean;
  loading: boolean;
  detailData: Record<string, unknown> | null;
  documents: string[];
  onClose: () => void;
  planLoading: boolean;
  planResult: unknown;
  verifyLoading: boolean;
  verifyResult: unknown;
  onPlan: () => void;
  onVerify: () => void;
  onApprovePlan: () => Promise<boolean>;
  onApproveVerify: () => Promise<boolean>;
};

export default function RequirementDrawer({
  open,
  loading,
  detailData,
  documents,
  onClose,
  planLoading,
  planResult,
  verifyLoading,
  verifyResult,
  onPlan,
  onVerify,
  onApprovePlan,
  onApproveVerify,
}: RequirementDrawerProps) {
  const [section, setSection] = useState<RequirementSection>("overview");
  useEffect(() => setSection("overview"), [detailData]);
  return (
    <Drawer
      title={null}
      closable={false}
      styles={{ header: { display: "none" }, body: { padding: 0, height: "100%" } }}
      width="70%"
      open={open}
      onClose={onClose}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Spin size="large" />
          <span className="text-[#66758d]">Đang tải chi tiết task...</span>
        </div>
      ) : detailData ? (
        <div className="flex h-full flex-col">
          <Tabs detailData={detailData} active={section} onChange={setSection} />
          <div className="min-h-0 flex-1 overflow-y-auto">
            {section === "overview" ? (
              <Overview detailData={detailData} documents={documents} />
            ) : (
              <TestDesign
                planLoading={planLoading}
                planResult={planResult}
                verifyLoading={verifyLoading}
                verifyResult={verifyResult}
                onPlan={onPlan}
                onVerify={onVerify}
                onApprovePlan={onApprovePlan}
                onApproveVerify={onApproveVerify}
              />
            )}
          </div>
        </div>
      ) : (
        <Empty description="Không tìm thấy thông tin chi tiết task" />
      )}
    </Drawer>
  );
}
