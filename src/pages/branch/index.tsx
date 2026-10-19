import { useEffect, useState } from "react";
import { Alert, Button, Form } from "@/components";
import { branchApi } from "@/apis/branch";
import { roleApi } from "@/apis/role";
import type { ManagedBranch, SaveBranch } from "@/apis/branch";
import { settingsError } from "@/apis/settings";
import { useSearchQuery } from "@/hooks/useQuery";
import BranchHeader from "./components/BranchHeader";
import BranchToolbar from "./components/BranchToolbar";
import BranchTable from "./components/BranchTable";
import BranchEditor from "./components/BranchEditor";
import DeleteBranchDialog from "./components/DeleteBranchDialog";

export default function BranchPage() {
  const { params, onParams } = useSearchQuery();
  const search = typeof params.search === "string" ? params.search : "";
  const requestedPage =
    typeof params.page === "string" && /^\d+$/.test(params.page) && +params.page > 0 && +params.page <= 1000000
      ? +params.page
      : 1;
  const [branches, setBranches] = useState<ManagedBranch[]>([]);
  const [total, setTotal] = useState(0);
  const [mine, setMine] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState<ManagedBranch | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState<ManagedBranch | null>(null);
  const [revision, setRevision] = useState(0);
  const [form] = Form.useForm<SaveBranch>();
  const page = requestedPage;
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = window.setTimeout(() => {
      void roleApi
        .myPermissions(controller.signal)
        .then(async (available) => {
          if (controller.signal.aborted) return;
          setMine(available);
          if (!available.includes("branch.read")) {
            setBranches([]);
            setTotal(0);
            setError("You do not have permission to view branches.");
            return;
          }
          const result = await branchApi.list({ search, page, pageSize: 10 }, controller.signal);
          if (controller.signal.aborted) return;
          setBranches(result.items);
          setTotal(result.total);
          const lastPage = Math.max(1, Math.ceil(result.total / 10));
          if (page > lastPage) onParams({ ...params, page: String(lastPage) });
        })
        .catch((failure) => {
          if (!controller.signal.aborted) setError(settingsError(failure));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, page, revision]);
  const openEditor = async (branch?: ManagedBranch) => {
    setDialogError("");
    setSuccess("");
    if (branch) {
      setSaving(true);
      try {
        const detail = await branchApi.detail(branch.id);
        form.resetFields();
        form.setFieldsValue(detail);
        setEditing(detail);
        setEditorOpen(true);
      } catch (failure) {
        setError(settingsError(failure));
      } finally {
        setSaving(false);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({ name: "", ocr_ccu: 1, llm_ccu: 1 });
      setEditing(null);
      setEditorOpen(true);
    }
  };
  const save = async (values: SaveBranch) => {
    setSaving(true);
    setDialogError("");
    try {
      if (editing) await branchApi.update(editing.id, values);
      else await branchApi.create(values);
      setEditorOpen(false);
      setSuccess("Branch saved.");
      setRevision((value) => value + 1);
    } catch (failure) {
      setDialogError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setSaving(true);
    setDialogError("");
    try {
      await branchApi.remove(deleting.id);
      setDeleting(null);
      setSuccess("Branch deleted.");
      setRevision((value) => value + 1);
    } catch (failure) {
      setDialogError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="w-full min-w-0">
      <BranchHeader
        loading={loading}
        busy={saving}
        canCreate={mine.includes("branch.create")}
        onAdd={() => void openEditor()}
        onRefresh={() => setRevision((value) => value + 1)}
      />
      {error && (
        <Alert
          className="mb-4"
          type="error"
          title={error}
          showIcon
          action={
            <Button type="link" onClick={() => setRevision((value) => value + 1)}>
              Retry
            </Button>
          }
        />
      )}
      {success && !error && <Alert className="mb-4" type="success" title={success} showIcon />}
      <div className="overflow-hidden rounded-2xl border border-solid border-[#e7e5ee] bg-white dark:border-[#27252e] dark:bg-[#0f0e14]">
        <BranchToolbar
          search={search}
          onSearch={(value) => onParams({ ...params, search: value || undefined, page: "1" })}
        />
        <BranchTable
          branches={branches}
          loading={loading}
          busy={saving || loading}
          canUpdate={mine.includes("branch.update")}
          canDelete={mine.includes("branch.delete")}
          page={page}
          total={total}
          onPage={(value) => onParams({ ...params, page: String(value) })}
          onEdit={(branch) => void openEditor(branch)}
          onDelete={(branch) => {
            setDialogError("");
            setSuccess("");
            setDeleting(branch);
          }}
        />
      </div>
      <BranchEditor
        open={editorOpen}
        branch={editing}
        form={form}
        saving={saving}
        error={dialogError}
        onSave={(values) => void save(values)}
        onCancel={() => !saving && setEditorOpen(false)}
      />
      <DeleteBranchDialog
        branch={deleting}
        saving={saving}
        error={dialogError}
        onDelete={() => void remove()}
        onCancel={() => !saving && setDeleting(null)}
      />
    </section>
  );
}
