import { Button } from "antd";
import { Link } from "react-router-dom";
import { getStringValue } from "../helper";
import { PATHNAME } from "@/utils/Pathname";

export default function Overview({
  detailData,
  documents = [],
}: {
  detailData: Record<string, unknown>;
  documents?: string[];
}) {
  const issueKey = getStringValue(detailData.key) || "---";
  const requirementId = getStringValue(detailData.requirementId || detailData.requirement_id) || "---";
  const facts = [
    ["Requirement ID", requirementId],
    ["Type", getStringValue(detailData.issueType || detailData.issuetype) || "Task"],
    ["Sprint", getStringValue(detailData.sprint) || "TES Sprint 4"],
    ["Assignee", getStringValue(detailData.assignee) || "---"],
    ["Sync status", "Synced"],
    ["Test design", "See /test-design"],
    ["Labels", "—"],
    ["Last sync", getStringValue(detailData.updated || detailData.updatedAt) || "---"],
  ];
  return (
    <div className="space-y-5 px-6 py-6 text-[13px] text-[#1a2638]">
      <section>
        <h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Description</h3>
        <p className="m-0 whitespace-pre-wrap">{getStringValue(detailData.description) || "---"}</p>
      </section>
      <section className="grid grid-cols-2 gap-x-10 gap-y-3">
        {facts.map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="font-bold uppercase text-[#65738b]">{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </section>
      <section>
        <h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Traceability</h3>
        <div className="space-y-2 rounded-lg border border-solid border-[#e1e8f0] bg-[#fbfaf7] p-3">
          Jira: <span className="text-[#4f7fb8]">{issueKey}</span>
          <div>↔ Requirement: {requirementId}</div>
          <div>↔ Test Cases: 0 cases</div>
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Test Case Status</h3>
        <div className="rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] py-4 text-center text-[#69778d]">
          No test cases have been generated yet.
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Test Data</h3>
        <div className="rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] p-3 text-[#69778d]">
          No dataset linked to this requirement yet.
        </div>
      </section>
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="m-0 text-[12px] font-bold uppercase text-[#65738b]">RSD Documents</h3>
          <div className="flex gap-2">
            <Button size="small">Confluence link</Button>
            <Button type="primary" size="small" className="!bg-[#5b83bb]">
              Upload RSD
            </Button>
          </div>
        </div>
        {documents.length ? (
          <div className="overflow-hidden rounded-lg bg-white">
            {documents.map((name) => (
              <Link
                key={name}
                to={`${PATHNAME.KNOWLEDGE}?issueKey=${encodeURIComponent(issueKey)}`}
                className="block truncate px-3 py-2 font-medium text-[#4f7fb8] last:border-b-0 hover:bg-[#f7faff] hover:underline"
                title={name}
              >
                {name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] py-8 text-center text-[#69778d]">
            No documents yet
          </div>
        )}
      </section>
    </div>
  );
}
