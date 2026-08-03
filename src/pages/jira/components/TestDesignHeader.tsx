import Tabs from "./Tabs";

type TestDesignHeaderProps = {
  detailData: Record<string, unknown>;
  onOverview: () => void;
  onTestDesign: () => void;
};

export default function TestDesignHeader({ detailData, onOverview, onTestDesign }: TestDesignHeaderProps) {
  return (
    <Tabs
      detailData={detailData}
      active="test-design"
      onChange={(section) => (section === "overview" ? onOverview() : onTestDesign())}
    />
  );
}
