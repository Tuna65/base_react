import { CalendarOutlined, FileAddOutlined, ProfileOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Alert, Button, Empty, List, Spin, Steps, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { extractMarkdownMajorSections, extractPlanMajorSections, getMarkdownMajorSection } from "../helper";
import { getSafeMarkdownUrl, markdownComponents, normalizeMarkdown } from "../../preview/helper";
import MarkdownTableOfContents from "@/components/MarkdownTableOfContents";

const { Text } = Typography;

type TestDesignProps = {
  planLoading: boolean;
  planResult: unknown;
  verifyLoading: boolean;
  verifyResult: unknown;
  onPlan: () => void;
  onVerify: () => void;
  onApprovePlan: () => Promise<boolean>;
  onApproveVerify: () => Promise<boolean>;
};

type StepConfig = {
  title: string;
  icon: ReactNode;
  result: unknown;
  loading: boolean;
  passed: boolean;
  onGenerate: () => void;
  onApprove: () => Promise<boolean>;
  generateLabel: string;
  processingLabel: string;
  emptyLabel: string;
  actionOnly?: boolean;
};

const isPassed = (value: unknown) =>
  Boolean(value) && typeof value === "object" && "state" in value && (value as { state?: unknown }).state === "PASSED";

const getContent = (value: unknown) =>
  typeof value === "string"
    ? value
    : value && typeof value === "object" && "content" in value
      ? String((value as { content?: unknown }).content || "")
      : "";

export default function TestDesign(props: TestDesignProps) {
  const verifyPassed = isPassed(props.verifyResult);
  const planPassed = isPassed(props.planResult);
  const progressStep = planPassed ? 2 : verifyPassed ? 1 : 0;
  const [selectedStep, setSelectedStep] = useState(progressStep);
  const [selectedSection, setSelectedSection] = useState<number | "all" | null>(null);

  useEffect(() => {
    setSelectedStep(progressStep);
  }, [progressStep]);

  const steps: StepConfig[] = [
    {
      title: "Verify",
      icon: <SafetyCertificateOutlined />,
      result: props.verifyResult,
      loading: props.verifyLoading,
      passed: verifyPassed,
      onGenerate: props.onVerify,
      onApprove: props.onApproveVerify,
      generateLabel: props.verifyResult ? "Regen Verify" : "Run Verify",
      processingLabel: "Đang verify tài liệu...",
      emptyLabel: "No verification has been generated yet.",
    },
    {
      title: "Plan",
      icon: <CalendarOutlined />,
      result: props.planResult,
      loading: props.planLoading,
      passed: planPassed,
      onGenerate: props.onPlan,
      onApprove: props.onApprovePlan,
      generateLabel: props.planResult ? "Regen Plan" : "Create Plan",
      processingLabel: "Đang tạo plan...",
      emptyLabel: "No plan has been generated yet.",
    },
    {
      title: "Generate Test Design",
      icon: <FileAddOutlined />,
      result: null,
      loading: false,
      passed: false,
      onGenerate: () => undefined,
      onApprove: async () => false,
      generateLabel: "Generate Test Design",
      processingLabel: "",
      emptyLabel: "",
      actionOnly: true,
    },
  ];
  const selected = steps[selectedStep];
  const content = getContent(selected.result);
  const majorSections = selectedStep === 1 ? extractPlanMajorSections(content) : extractMarkdownMajorSections(content);

  useEffect(() => {
    setSelectedSection(null);
  }, [content]);

  const visibleContent =
    selectedSection === "all"
      ? content
      : typeof selectedSection === "number"
        ? getMarkdownMajorSection(content, majorSections, selectedSection)
        : "";
  const selectedMajorSection = typeof selectedSection === "number" ? majorSections[selectedSection] : undefined;

  return (
    <div className="p-3">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Steps
          current={progressStep}
          onChange={setSelectedStep}
          responsive={false}
          className="min-w-0 flex-1 cursor-pointer"
          items={steps.map((step, index) => ({
            icon: step.icon,
            title: (
              <button
                type="button"
                onClick={() => setSelectedStep(index)}
                className={`cursor-pointer border-0 bg-transparent p-0 ${selectedStep === index ? "font-semibold text-[#4f7fb8]" : ""}`}
              >
                {step.title} {selectedStep === index && <small className="ml-1 text-[10px]">● Viewing</small>}
              </button>
            ),
          }))}
        />
        <div className="ml-5 flex shrink-0 gap-2">
          {selected.actionOnly ? (
            <Button size="small" type="primary" disabled className="!bg-[#5b83bb]">
              {selected.generateLabel}
            </Button>
          ) : (
            !selected.passed && (
              <>
                <Button
                  size="small"
                  type="primary"
                  loading={selected.loading}
                  onClick={selected.onGenerate}
                  className="!bg-[#5b83bb]"
                >
                  {selected.generateLabel}
                </Button>
                <Button
                  size="small"
                  disabled={!selected.result || selected.loading}
                  onClick={() => void selected.onApprove()}
                >
                  Duyệt
                </Button>
              </>
            )
          )}
        </div>
      </div>

      {selected.actionOnly ? null : selected.loading ? (
        <div className="py-12 text-center">
          <Spin />
          <div className="mt-3 text-[#66758d]">{selected.processingLabel}</div>
        </div>
      ) : content ? (
        <div className={selectedSection === null ? "space-y-4" : "grid grid-cols-2 items-start gap-6"}>
          {majorSections.length > 0 && (
            <MarkdownTableOfContents
              items={majorSections}
              activeIndex={typeof selectedSection === "number" ? selectedSection : null}
              onSelect={setSelectedSection}
              allLabel="Tất cả nội dung"
              allActive={selectedSection === "all"}
              onSelectAll={() => setSelectedSection("all")}
              metaLabel={(section) => `H${section.level}`}
            />
          )}
          {false && majorSections.length > 0 && (
            <aside className="sticky top-0 max-h-[calc(100vh-160px)] min-w-0 self-start overflow-y-auto rounded-lg border border-gray-200 border-r-2 border-r-[#d9e2ef] bg-gray-50 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                <ProfileOutlined className="text-base text-blue-500" />
                <Text strong className="text-base text-gray-800">
                  Mục lục tài liệu
                </Text>
                <Tag color="blue" className="!ml-auto !mr-0">
                  {majorSections.length} mục
                </Tag>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSection("all")}
                className={`mb-1 flex w-full cursor-pointer items-center gap-2 rounded-md p-1.5 text-left transition-all ${selectedSection === "all" ? "bg-blue-100 font-semibold text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <Text
                  strong={selectedSection === "all"}
                  className={`max-w-[70%] text-sm ${selectedSection === "all" ? "text-blue-700" : ""}`}
                >
                  Tất cả nội dung
                </Text>
                <span className="min-w-2 flex-1 border-b border-dotted border-gray-300" />
              </button>
              <List
                size="small"
                dataSource={majorSections}
                renderItem={(section, index) => {
                  const active = selectedSection === index;
                  return (
                    <List.Item className="!border-0 !px-0 !py-1">
                      <button
                        type="button"
                        onClick={() => setSelectedSection(index)}
                        style={{ paddingLeft: (section.level - 1) * 12 + 6 }}
                        className={`!bg-transparent flex w-full cursor-pointer items-center gap-2 rounded-md p-1.5 text-left transition-all ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
                      >
                        <Text
                          strong={section.level === 1 || active}
                          ellipsis={{ tooltip: section.title }}
                          className={`max-w-[70%] ${section.level === 1 ? "text-[15px]" : section.level === 2 ? "text-sm" : "text-[13px]"} ${active ? "text-blue-700" : ""}`}
                        >
                          {section.title}
                        </Text>
                        <span className="min-w-2 flex-1 border-b border-dotted border-gray-300" />
                        <Tag color={active ? "blue" : "purple"} className="!m-0 text-xs">
                          H{section.level}
                        </Tag>
                      </button>
                    </List.Item>
                  );
                }}
              />
            </aside>
          )}
          {selectedSection !== null && (
            <section className="space-y-4">
              {selectedMajorSection && (
                <Alert
                  type="info"
                  showIcon
                  message={
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        Đang xem mục: <strong>{selectedMajorSection.title}</strong>
                      </span>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setSelectedSection("all")}
                        className="!h-auto !p-0 font-medium"
                      >
                        Xem tất cả nội dung
                      </Button>
                    </div>
                  }
                />
              )}
              <article className="markdown-body relative overflow-x-auto rounded-lg border border-gray-200 bg-white px-6 pb-14 pt-6 shadow-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  urlTransform={getSafeMarkdownUrl}
                  components={markdownComponents}
                >
                  {normalizeMarkdown(visibleContent)}
                </ReactMarkdown>
              </article>
            </section>
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={selected.emptyLabel} />
      )}
    </div>
  );
}
