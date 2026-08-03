import { Alert, Button, Empty, Spin, Tag, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import MarkdownTableOfContents from "@/components/MarkdownTableOfContents";
import {
  MarkdownHeading,
  MarkdownPage,
  getHeadingSection,
  getSafeMarkdownUrl,
  markdownComponents,
  normalizeMarkdown,
} from "../helper";

const { Text } = Typography;

type KnowledgeDetailContentProps = {
  loading: boolean;
  markdown: string;
  markdownPages: MarkdownPage[];
  headings: MarkdownHeading[];
  selectedHeadingIndex: number | null;
  onSelectedHeadingChange: (index: number | null) => void;
};

export default function KnowledgeDetailContent({
  loading, markdown, markdownPages, headings, selectedHeadingIndex, onSelectedHeadingChange,
}: KnowledgeDetailContentProps) {
  const selectedHeading = selectedHeadingIndex === null ? undefined : headings[selectedHeadingIndex];
  const visiblePages = selectedHeading
    ? [{ page: selectedHeading.page, markdown: getHeadingSection(markdown, selectedHeading, headings, selectedHeadingIndex ?? 0) }]
    : markdownPages.length ? markdownPages : [{ page: 1, markdown }];

  if (loading) return <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 py-16"><Spin size="large" /><Text type="secondary">Đang nhận dạng nội dung tài liệu...</Text></div>;
  if (!markdown) return <Empty className="my-16" description="Chưa có kết quả Markdown cho tài liệu này" />;

  return <div className="grid grid-cols-2 items-start gap-6">
    <MarkdownTableOfContents items={headings} activeIndex={selectedHeadingIndex} onSelect={onSelectedHeadingChange} metaLabel={(heading) => `Trang ${heading.page}`} />
    <section className="min-w-0 space-y-4">
      {selectedHeading && <Alert type="info" showIcon className="!mb-2" message={<div className="flex items-center justify-between"><span>Đang xem mục: <strong>{selectedHeading.title}</strong> (Trang {selectedHeading.page})</span><Button type="link" size="small" onClick={() => onSelectedHeadingChange(null)} className="!h-auto !p-0 font-medium">Xem tất cả nội dung</Button></div>} />}
      {visiblePages.map((page) => <article key={page.page} className="markdown-body relative overflow-x-auto rounded-lg border border-gray-200 bg-white px-6 pb-14 pt-6 shadow-sm"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} urlTransform={getSafeMarkdownUrl} components={markdownComponents}>{normalizeMarkdown(page.markdown)}</ReactMarkdown><Tag color="purple" className="!absolute !bottom-4 !right-4 !m-0">Trang {page.page}</Tag></article>)}
    </section>
  </div>;
}
