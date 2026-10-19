import { Table } from "@/components";
import type { LlmAgent, LlmKind, LlmSkill } from "@/apis/llm";
import type { Editor } from "./types";
import RecordsToolbar from "./RecordsToolbar";
import RecordActions from "./RecordActions";
import { panel } from "./styles";

type Props = {
  skills: LlmSkill[];
  query: string;
  loading: boolean;
  saving: boolean;
  onQueryChange: (query: string) => void;
  onEdit: (kind: LlmKind, record?: LlmAgent | LlmSkill) => void;
  onDelete: (editor: Editor) => void;
};

export default function SkillsPanel(props: Props) {
  const { skills, query, loading, saving, onQueryChange, onEdit, onDelete } = props;
  return (
    <div className={panel}>
      <RecordsToolbar
        kind="skills"
        query={query}
        disabled={loading || saving}
        onQueryChange={onQueryChange}
        onAdd={() => onEdit("skills")}
      />
      <Table<LlmSkill>
        className="dark:[&_.ant-table]:!bg-[#111015] dark:[&_.ant-table]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!bg-[#1b1923] dark:[&_.ant-table-thead>tr>th]:!text-[#b9b5c7] dark:[&_.ant-table-thead>tr>th]:!border-[#27252e] dark:[&_.ant-table-tbody>tr>td]:!bg-[#111015] dark:[&_.ant-table-tbody>tr>td]:!border-[#27252e]"
        rowKey="id"
        loading={loading}
        dataSource={skills.filter((item) =>
          `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
        )}
        scroll={{ x: 650 }}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        columns={[
          { title: "Name", dataIndex: "name", width: 180 },
          { title: "Description", dataIndex: "description", ellipsis: true },
          { title: "System prompt", dataIndex: "systemPrompt", ellipsis: true },
          {
            title: "Actions",
            width: 155,
            render: (_, row) => (
              <RecordActions
                disabled={loading || saving}
                onEdit={() => onEdit("skills", row)}
                onDelete={() => onDelete({ kind: "skills", record: row })}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
