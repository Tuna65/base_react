import { Button } from "@/components";

type Props = { disabled: boolean; onEdit: () => void; onDelete: () => void };

export default function RecordActions({ disabled, onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-2">
      <Button size="small" onClick={onEdit} disabled={disabled}>Edit</Button>
      <Button size="small" danger onClick={onDelete} disabled={disabled}>Delete</Button>
    </div>
  );
}
