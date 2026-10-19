import { Alert } from "@/components";
import type { ExtractData } from "@/apis/document";
export default function ExtractionResults({ data }: { data: ExtractData | null }) {
  if (!data) return <Alert type="info" title="No extract data available." showIcon />;
  return (
    <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/5 p-3 text-xs">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
