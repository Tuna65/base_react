import { Button } from "@/components";

type Props = { loading: boolean; saving: boolean; onRefresh: () => void };

export default function LlmHeader(props: Props) {
  const { loading, saving, onRefresh } = props;
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="m-0 text-2xl font-semibold">LLM management</h1>
        <p className="mt-2 text-sm text-[#797586] dark:text-[#93909f]">
          Configure your model, agents and reusable skills.
        </p>
      </div>
      <Button onClick={onRefresh} loading={loading} disabled={saving}>
        Refresh
      </Button>
    </div>
  );
}
