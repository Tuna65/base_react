import { useEffect, useState } from "react";
import { Alert, Button, Form } from "@/components";
import { roleApi } from "@/apis/role";
import type { ManagedRole, PermissionOption, SaveRole } from "@/apis/role";
import { settingsError } from "@/apis/settings";
import { useSearchQuery } from "@/hooks/useQuery";
import RoleHeader from "./components/RoleHeader";
import RoleToolbar from "./components/RoleToolbar";
import RoleTable from "./components/RoleTable";
import RoleEditor from "./components/RoleEditor";
import DeleteRoleDialog from "./components/DeleteRoleDialog";

export default function RolePage() {
  const { params, onParams } = useSearchQuery();
  const search = typeof params.search === "string" ? params.search : "";
  const requestedPage =
    typeof params.page === "string" && /^\d+$/.test(params.page) && +params.page > 0 ? +params.page : 1;
  const [roles, setRoles] = useState<ManagedRole[]>([]);
  const [permissions, setPermissions] = useState<PermissionOption[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState<ManagedRole | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState<ManagedRole | null>(null);
  const [revision, setRevision] = useState(0);
  const [form] = Form.useForm<SaveRole>();
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(roles.length / 10)));
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = window.setTimeout(() => {
      void Promise.all([
        roleApi.list(search, controller.signal),
        roleApi.permissions(controller.signal),
        roleApi.myPermissions(controller.signal),
      ])
        .then(([rows, catalog, available]) => {
          if (controller.signal.aborted) return;
          setRoles(rows);
          setPermissions(catalog);
          setMine(available);
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
  }, [search, revision]);
  const openEditor = async (role?: ManagedRole) => {
    setDialogError("");
    setSuccess("");
    if (role) {
      setSaving(true);
      try {
        const detail = await roleApi.detail(role.id);
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
      form.setFieldsValue({ name: "", description: "", permissions: [] });
      setEditing(null);
      setEditorOpen(true);
    }
  };
  const save = async (values: SaveRole) => {
    setSaving(true);
    setDialogError("");
    try {
      if (editing) await roleApi.update(editing.id, values);
      else await roleApi.create(values);
      setEditorOpen(false);
      setSuccess("Role saved.");
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
      await roleApi.remove(deleting.id);
      setDeleting(null);
      setSuccess("Role deleted.");
      setRevision((value) => value + 1);
    } catch (failure) {
      setDialogError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="w-full min-w-0">
      <RoleHeader
        loading={loading}
        busy={saving}
        canCreate={mine.includes("role.create")}
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
        <RoleToolbar
          search={search}
          onSearch={(value) => onParams({ ...params, search: value || undefined, page: "1" })}
        />
        <RoleTable
          roles={roles}
          loading={loading}
          busy={saving || loading}
          canUpdate={mine.includes("role.update")}
          canDelete={mine.includes("role.delete")}
          page={page}
          onPage={(value) => onParams({ ...params, page: String(value) })}
          onEdit={(role) => void openEditor(role)}
          onDelete={(role) => {
            setDialogError("");
            setSuccess("");
            setDeleting(role);
          }}
        />
      </div>
      <RoleEditor
        open={editorOpen}
        role={editing}
        form={form}
        permissions={permissions}
        saving={saving}
        error={dialogError}
        onSave={(values) => void save(values)}
        onCancel={() => !saving && setEditorOpen(false)}
      />
      <DeleteRoleDialog
        role={deleting}
        saving={saving}
        error={dialogError}
        onDelete={() => void remove()}
        onCancel={() => !saving && setDeleting(null)}
      />
    </section>
  );
}
