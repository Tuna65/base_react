import { Table } from "@/components";
import type { LlmAgent, LlmKind, LlmSkill } from "@/apis/llm";
import type { Editor } from "./types";
import RecordsToolbar from "./RecordsToolbar";
import RecordActions from "./RecordActions";
import { panel } from "./styles";

type Props = {
  agents: LlmAgent[];
  query: string;
  loading: boolean;
  saving: boolean;
  onQueryChange: (query: string) => void;
  onEdit: (kind: LlmKind, record?: LlmAgent | LlmSkill) => void;
  onDelete: (editor: Editor) => void;
};

export default function AgentsPanel(props: Props) {
  const { agents, query, loading, saving, onQueryChange, onEdit, onDelete } = props;
  return (
    <div className={panel}>
      <RecordsToolbar kind="agents" query={query} disabled={loading || saving} onQueryChange={onQueryChange} onAdd={() => onEdit("agents")} />
      <Table<LlmAgent>
        className="dark:[&_.ant-table]:!bg-[#111015] dark:[&_.ant-table]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!bg-[#1b1923] dark:[&_.ant-table-thead>tr>th]:!text-[#b9b5c7] dark:[&_.ant-table-thead>tr>th]:!border-[#27252e] dark:[&_.ant-table-tbody>tr>td]:!bg-[#111015] dark:[&_.ant-table-tbody>tr>td]:!border-[#27252e]"
        rowKey="id"
        loading={loading}
        dataSource={agents.filter((item) => `${item.name} ${item.agent_id}`.toLowerCase().includes(query.toLowerCase()))}
        scroll={{ x: 650 }}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        columns={[
          { title: "Name", dataIndex: "name", width: 180 },
          { title: "Agent ID", dataIndex: "agent_id", width: 180 },
          { title: "Skill", width: 170, render: (_, row) => row.skill?.name ?? "No skill" },
          { title: "Actions", width: 155, render: (_, row) => <RecordActions disabled={loading || saving} onEdit={() => onEdit("agents", row)} onDelete={() => onDelete({ kind: "agents", record: row })} /> },
        ]}
      />
    </div>
  );
}
