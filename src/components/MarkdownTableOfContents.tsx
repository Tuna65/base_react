import { ProfileOutlined } from "@ant-design/icons";
import { Empty, List, Tag, Typography } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

export type TableOfContentsItem = { title: string; level: number };

type MarkdownTableOfContentsProps<T extends TableOfContentsItem> = {
  items: T[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
  metaLabel: (item: T, index: number) => ReactNode;
  allLabel?: string;
  allActive?: boolean;
  onSelectAll?: () => void;
  title?: string;
  emptyText?: string;
};

export default function MarkdownTableOfContents<T extends TableOfContentsItem>({
  items,
  activeIndex,
  onSelect,
  metaLabel,
  allLabel,
  allActive = false,
  onSelectAll,
  title = "Mục lục tài liệu",
  emptyText = "Không có mục lục",
}: MarkdownTableOfContentsProps<T>) {
  return (
    <aside className="sticky top-0 max-h-[calc(100vh-80px)] min-w-0 self-start overflow-y-auto rounded-lg border border-gray-200 border-r-2 border-r-[#d9e2ef] bg-gray-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
        <ProfileOutlined className="text-base text-blue-500" />
        <Text strong className="text-base text-gray-800">
          {title}
        </Text>
        <Tag color="blue" className="!ml-auto !mr-0">
          {items.length} mục
        </Tag>
      </div>
      {allLabel && onSelectAll && (
        <button
          type="button"
          onClick={onSelectAll}
          className={`mb-1 flex w-full cursor-pointer items-center gap-2 rounded-md p-1.5 text-left transition-all ${allActive ? "bg-blue-100 font-semibold text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
        >
          <Text strong={allActive} className={`max-w-[70%] text-sm ${allActive ? "text-blue-700" : ""}`}>
            {allLabel}
          </Text>
          <span className="min-w-2 flex-1 border-b border-dotted border-gray-300" />
        </button>
      )}
      {items.length ? (
        <List
          size="small"
          dataSource={items}
          renderItem={(item, index) => {
            const active = activeIndex === index;
      const titleClass = item.level === 1 ? "text-[15px] font-bold" : item.level === 2 ? "text-sm font-semibold" : "text-[13px] font-normal";
            return (
              <List.Item className="!border-0 !px-0 !py-0">
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  style={{ paddingLeft: (item.level - 1) * 12 + 6 }}
                  className={`!bg-transparent flex w-full cursor-pointer items-center gap-2 rounded-md p-1 text-left transition-all ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
                >
                  <Text
                    strong={item.level === 1 || active}
                    ellipsis={{ tooltip: item.title }}
                    className={`max-w-[70%] ${titleClass} ${active ? "text-blue-700" : ""}`}
                  >
                    {item.title}
                  </Text>
                  <span className="min-w-2 flex-1 border-b border-dotted border-gray-300" />
                  <Tag color={active ? "blue" : "purple"} className="!m-0 text-xs">
                    {metaLabel(item, index)}
                  </Tag>
                </button>
              </List.Item>
            );
          }}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
      )}
    </aside>
  );
}
