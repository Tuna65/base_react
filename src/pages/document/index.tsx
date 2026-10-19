import { useEffect, useState } from "react";
import { Alert, Button } from "@/components";
import { documentApi } from "@/apis/document";
import type { ManagedDocument, DocumentList } from "@/apis/document";
import { roleApi } from "@/apis/role";
import { settingsError } from "@/apis/settings";
import { useSearchQuery } from "@/hooks/useQuery";
import DocumentHeader from "./components/DocumentHeader";
import DocumentToolbar from "./components/DocumentToolbar";
import DocumentTable from "./components/DocumentTable";
import DocumentEditor from "./components/DocumentEditor";
import DocumentDetails from "./components/DocumentDetails";
import DeleteDocumentDialog from "./components/DeleteDocumentDialog";

export default function DocumentPage() {
  const { params, onParams } = useSearchQuery();
  const search = typeof params.search === "string" ? params.search : "";
  const page =
    typeof params.page === "string" && /^\d+$/.test(params.page) && +params.page > 0 && +params.page <= 1000000
      ? +params.page
      : 1;
  const pageSize = [10, 20, 50].includes(Number(params.pageSize)) ? Number(params.pageSize) : 10;
  const [data, setData] = useState<DocumentList>({ items: [], total: 0, page: 1, pageSize: 10 });
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [notice, setNotice] = useState<{ text: string; type: "success" | "warning" } | null>(null);
  const [editing, setEditing] = useState<ManagedDocument | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewing, setViewing] = useState<ManagedDocument | null>(null);
  const [deleting, setDeleting] = useState<ManagedDocument | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = window.setTimeout(() => {
      void Promise.all([
        documentApi.list({ search, page, pageSize }, controller.signal),
        roleApi.myPermissions(controller.signal),
      ])
        .then(([list, mine]) => {
          if (!controller.signal.aborted) {
            setData(list);
            setPermissions(mine);
          }
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
  }, [search, page, pageSize, revision]);
  const openEditor = (document?: ManagedDocument) => {
    setDialogError("");
    setNotice(null);
    setEditing(document ?? null);
    setEditorOpen(true);
  };
  const upload = async (file: File) => {
    setDialogError("");
    if (!file.size || file.size > 10 * 1024 * 1024) {
      setDialogError("Choose a non-empty file up to 10 MB.");
      return;
    }
    setUploading(true);
    try {
      if (editing) await documentApi.replaceFile(editing.id, file);
      else await documentApi.upload(file);
      setEditorOpen(false);
      setRevision((value) => value + 1);
      onParams({ ...params, page: "1" });
      setNotice({ text: "Document saved from uploaded file.", type: "success" });
    } catch (failure) {
      setDialogError(settingsError(failure));
    } finally {
      setUploading(false);
    }
  };
  const view = async (document: ManagedDocument) => {
    setBusy(true);
    setError("");
    try {
      setViewing(await documentApi.detail(document.id));
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    setDialogError("");
    try {
      await documentApi.remove(deleting.id);
      setDeleting(null);
      onParams({ ...params, page: "1" });
      setRevision((value) => value + 1);
      setNotice({ text: "Document deleted.", type: "success" });
    } catch (failure) {
      setDialogError(settingsError(failure));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="w-full min-w-0">
      <DocumentHeader
        loading={loading}
        busy={busy || uploading}
        canCreate={permissions.includes("document.create") && permissions.includes("document.upload")}
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
      {notice && !error && <Alert className="mb-4" type={notice.type} title={notice.text} showIcon />}
      <div className="overflow-hidden rounded-2xl border border-solid border-[#e7e5ee] bg-white dark:border-[#27252e] dark:bg-[#0f0e14]">
        <DocumentToolbar
          search={search}
          onSearch={(value) => onParams({ ...params, search: value || undefined, page: "1" })}
        />
        <DocumentTable
          documents={data.items}
          total={data.total}
          page={page}
          pageSize={pageSize}
          loading={loading}
          busy={busy || uploading || loading}
          permissions={permissions}
          onPage={(nextPage, size) => onParams({ ...params, page: String(nextPage), pageSize: String(size) })}
          onView={(document) => void view(document)}
          onEdit={(document) => void openEditor(document)}
          onDelete={(document) => {
            setDialogError("");
            setNotice(null);
            setDeleting(document);
          }}
        />
      </div>
      <DocumentEditor
        open={editorOpen}
        document={editing}
        uploading={uploading}
        error={dialogError}
        onUpload={(file) => void upload(file)}
        onCancel={() => !uploading && setEditorOpen(false)}
      />
      <DocumentDetails document={viewing} onClose={() => setViewing(null)} />
      <DeleteDocumentDialog
        document={deleting}
        busy={busy}
        error={dialogError}
        onDelete={() => void remove()}
        onCancel={() => !busy && setDeleting(null)}
      />
    </section>
  );
}
