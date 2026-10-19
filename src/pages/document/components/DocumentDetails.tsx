import { Dialog, Tabs } from "@/components";
import { useSearchQuery } from "@/hooks/useQuery";
import type { ManagedDocument } from "@/apis/document";
import ExtractionResults from "./ExtractionResults";
export default function DocumentDetails({
  document,
  onClose,
}: {
  document: ManagedDocument | null;
  onClose: () => void;
}) {
  const { params, onParams } = useSearchQuery();
  const tab = params.doc_tab === "results" ? "results" : "content";
  return (
    <Dialog width={950} open={!!document} title={document?.name || "Document"} onCancel={onClose} footer={null}>
      <div className="mb-4 space-y-1 text-sm">
        <p>{document?.filename}</p>
        <p className="break-all opacity-70">{document?.url}</p>
      </div>
      <Tabs
        activeKey={tab}
        onChange={(key) => onParams({ ...params, doc_tab: key })}
        items={[
          {
            key: "content",
            label: "Content",
            children: (
              <pre className="m-0 whitespace-pre-wrap break-words text-sm">
                {document?.content || "Content is not available yet."}
              </pre>
            ),
          },
          {
            key: "results",
            label: "Extract data",
            children: <ExtractionResults data={document?.extract_data ?? null} />,
          },
        ]}
      />
    </Dialog>
  );
}
