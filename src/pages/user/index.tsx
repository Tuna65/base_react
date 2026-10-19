import { useEffect, useState } from "react";
import type { Key } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Form } from "@/components";
import { branchApi } from "@/apis/branch";
import type { BranchOption } from "@/apis/branch";
import { roleApi } from "@/apis/role";
import type { RoleOption } from "@/apis/role";
import { userApi } from "@/apis/user";
import type { ManagedUser, SaveUser, UserList } from "@/apis/user";
import { settingsError } from "@/apis/settings";
import { useSearchQuery } from "@/hooks/useQuery";
import { userSelector } from "@/store/modules/auth/selector";
import { authActions } from "@/store/modules/auth";
import { sessionStorageUtil } from "@/service/storage";
import { STORAGE } from "@/configs/storage";
import UserHeader from "./components/UserHeader";
import UserToolbar from "./components/UserToolbar";
import UserTable from "./components/UserTable";
import UserEditor from "./components/UserEditor";
import DeleteUsersDialog from "./components/DeleteUsersDialog";

export default function UserPage() {
  const { params, onParams } = useSearchQuery();
  const actor = useSelector(userSelector);
  const dispatch = useDispatch();
  const search = typeof params.search === "string" ? params.search : "";
  const status = params.status === "ACTIVE" || params.status === "INACTIVE" ? params.status : undefined;
  const page =
    typeof params.page === "string" && /^\d+$/.test(params.page) && +params.page > 0 && +params.page <= 1000000
      ? +params.page
      : 1;
  const pageSize = [10, 20, 50].includes(Number(params.pageSize)) ? Number(params.pageSize) : 10;
  const [data, setData] = useState<UserList>({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState<Key[]>([]);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState<ManagedUser[]>([]);
  const [revision, setRevision] = useState(0);
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [form] = Form.useForm<SaveUser>();
  const isSuperAdmin = actor?.username === "super_admin" || !!actor?.roles?.includes("super_admin");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setSelected([]);
    const timer = window.setTimeout(() => {
      void Promise.all([
        userApi.list({ search, status, page, pageSize }, controller.signal),
        branchApi.options(controller.signal),
      ])
        .then(([result, branches]) => {
          if (!controller.signal.aborted) {
            setData(result);
            setBranchOptions(branches);
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
  }, [search, status, page, pageSize, revision]);

  const openEditor = async (user?: ManagedUser) => {
    setDialogError("");
    setError("");
    setSuccess("");
    if (user) {
      setSaving(true);
      try {
        const [detail, choices, branches] = await Promise.all([
          userApi.detail(user.id),
          roleApi.options(),
          branchApi.options(),
        ]);
        setBranchOptions(branches);
        setRoleOptions(choices);
        form.resetFields();
        form.setFieldsValue({ ...detail, branch_id: detail.branch_id ?? undefined, password: "" });
        setEditing(detail);
        setEditorOpen(true);
      } catch (failure) {
        setError(settingsError(failure));
      } finally {
        setSaving(false);
      }
    } else {
      setSaving(true);
      try {
        const [choices, branches] = await Promise.all([roleApi.options(), branchApi.options()]);
        setBranchOptions(branches);
        setRoleOptions(choices);
        form.resetFields();
        form.setFieldsValue({
          branch_id: undefined,
          username: "",
          email: "",
          displayName: "",
          password: "",
          roles: choices.some((role) => role.name === "user") ? ["user"] : [],
          status: "ACTIVE",
          avatarUrl: "",
        });
        setEditing(null);
        setEditorOpen(true);
      } catch (failure) {
        setError(settingsError(failure));
      } finally {
        setSaving(false);
      }
    }
  };
  const save = async (values: SaveUser) => {
    setSaving(true);
    setDialogError("");
    try {
      const saved = editing ? await userApi.update(editing.id, values) : await userApi.create(values);
      if (saved.id === actor?.id) {
        dispatch(authActions.setUser(saved));
        sessionStorageUtil.set(saved, STORAGE.USER_KEY);
      }
      setEditorOpen(false);
      setSuccess("User saved.");
      setRevision((value) => value + 1);
    } catch (failure) {
      setDialogError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  const confirmDelete = (users: ManagedUser[]) => {
    setDialogError("");
    setSuccess("");
    setDeleting(users);
  };
  const remove = async () => {
    setSaving(true);
    setDialogError("");
    try {
      await userApi.remove(deleting.map((user) => user.id));
      setDeleting([]);
      setSelected([]);
      setSuccess("Users deleted.");
      onParams({ ...params, page: "1" });
      setRevision((value) => value + 1);
    } catch (failure) {
      setDialogError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="w-full min-w-0">
      <UserHeader disabled={saving || loading} onAdd={() => void openEditor()} />
      {error && (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          title={error}
          action={
            <Button type="link" onClick={() => setRevision((value) => value + 1)}>
              Retry
            </Button>
          }
        />
      )}
      {success && !error && <Alert className="mb-4" type="success" showIcon title={success} />}
      <div className="overflow-hidden rounded-2xl border border-solid border-[#e7e5ee] bg-white dark:border-[#27252e] dark:bg-[#0f0e14]">
        <UserToolbar
          search={search}
          status={status}
          selectedCount={selected.length}
          disabled={saving || loading}
          onSearch={(value) => onParams({ ...params, search: value || undefined, page: "1" })}
          onStatus={(value) => onParams({ ...params, status: value, page: "1" })}
          onDelete={() => confirmDelete(data.items.filter((user) => selected.includes(user.id)))}
        />
        <UserTable
          branches={branchOptions}
          users={data.items}
          total={data.total}
          page={page}
          pageSize={pageSize}
          loading={loading}
          busy={saving || loading}
          actorId={actor?.id}
          selected={selected}
          onSelection={setSelected}
          onPage={(nextPage, nextSize) => onParams({ ...params, page: String(nextPage), pageSize: String(nextSize) })}
          onEdit={(user) => void openEditor(user)}
          onDelete={confirmDelete}
        />
      </div>
      <UserEditor
        open={editorOpen}
        user={editing}
        form={form}
        saving={saving}
        error={dialogError}
        actorId={actor?.id}
        superAdmin={isSuperAdmin}
        roles={roleOptions}
        branches={branchOptions}
        onCancel={() => !saving && setEditorOpen(false)}
        onSave={(values) => void save(values)}
      />
      <DeleteUsersDialog
        users={deleting}
        saving={saving}
        error={dialogError}
        onCancel={() => !saving && setDeleting([])}
        onDelete={() => void remove()}
      />
    </section>
  );
}
