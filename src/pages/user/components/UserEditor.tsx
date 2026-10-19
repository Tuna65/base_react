import { Alert, Dialog, Form, Input, Select } from "@/components";
import type { BranchOption } from "@/apis/branch";
import type { RoleOption } from "@/apis/role";
import type { ManagedUser, SaveUser } from "@/apis/user";
import { roleLabels } from "./types";
import type { UserForm } from "./types";
type Props = {
  open: boolean;
  user: ManagedUser | null;
  form: UserForm;
  saving: boolean;
  error: string;
  actorId?: number;
  superAdmin: boolean;
  roles: RoleOption[];
  branches: BranchOption[];
  onCancel: () => void;
  onSave: (values: SaveUser) => void;
};
export default function UserEditor({
  open,
  user,
  form,
  saving,
  error,
  actorId,
  superAdmin,
  roles,
  branches,
  onCancel,
  onSave,
}: Props) {
  const bootstrap = user?.username === "super_admin";
  return (
    <Dialog
      forceRender
      width={900}
      open={open}
      title={user ? "Edit user" : "Add user"}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={saving}
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
    >
      {error && <Alert className="mb-4" type="error" showIcon title={error} />}
      <Form
        className="grid grid-cols-1 gap-x-6 md:grid-cols-2 [&>.ant-form-item]:min-w-0"
        form={form}
        layout="vertical"
        requiredMark={false}
        disabled={saving}
        onFinish={onSave}
      >
        <Form.Item name="displayName" label="Display name" rules={[{ max: 200 }]}>
          <Input maxLength={200} />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, whitespace: true },
            { pattern: /^[a-zA-Z0-9_.-]+$/, message: "Use letters, numbers, dots, underscores or hyphens." },
            { max: 100 },
          ]}
        >
          <Input disabled={bootstrap} autoComplete="off" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }, { max: 254 }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          extra={user ? "Leave blank to keep the current password." : "At least 8 characters, at most 72 UTF-8 bytes."}
          rules={[
            { required: !user },
            {
              validator: (_, value: string | undefined) =>
                !value || (value.length >= 8 && new TextEncoder().encode(value).length <= 72)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Password must have at least 8 characters and at most 72 bytes.")),
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="branch_id"
          label="Branch / Head Office"
          extra="New documents use this branch and its OCR / LLM limits."
          rules={[{ required: true, type: "number", message: "Select a branch." }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Select a branch"
            options={[
              ...branches.map((branch) => ({ value: branch.id, label: branch.name })),
              ...(user?.branch_id && !branches.some((branch) => branch.id === user.branch_id)
                ? [{ value: user.branch_id, label: `Branch #${user.branch_id} (unavailable)`, disabled: true }]
                : []),
            ]}
          />
        </Form.Item>
        <Form.Item name="roles" label="Roles" rules={[{ required: true, type: "array", min: 1 }]}>
          <Select
            mode="multiple"
            disabled={bootstrap}
            options={roles
              .filter((role) => superAdmin || role.name !== "super_admin")
              .map((role) => ({
                value: role.name,
                label: roleLabels[role.name] ?? role.name,
              }))}
          />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            disabled={bootstrap || user?.id === actorId}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Blocked" },
            ]}
          />
        </Form.Item>
        <Form.Item name="avatarUrl" label="Avatar URL (optional)" rules={[{ type: "url" }, { max: 2000 }]}>
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Dialog>
  );
}
