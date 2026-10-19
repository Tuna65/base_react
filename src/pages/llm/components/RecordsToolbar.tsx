import { Button, Input } from "@/components";
import type { LlmKind } from "@/apis/llm";

type Props = {
  kind: LlmKind;
  query: string;
  disabled: boolean;
  onQueryChange: (query: string) => void;
  onAdd: () => void;
};

export default function RecordsToolbar({ kind, query, disabled, onQueryChange, onAdd }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <Input className="max-w-xs" placeholder={`Search ${kind}...`} aria-label={`Search ${kind}`} allowClear value={query} onChange={(event) => onQueryChange(event.target.value)} />
      <Button type="primary" onClick={onAdd} disabled={disabled}>
        Add {kind === "agents" ? "agent" : "skill"}
      </Button>
    </div>
  );
}
