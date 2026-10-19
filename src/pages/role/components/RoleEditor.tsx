import { Alert, Dialog, Form, Input } from "@/components";
import type { ManagedRole, PermissionOption, SaveRole } from "@/apis/role";
import type { RoleForm } from "./types";
import PermissionPicker from "./PermissionPicker";
type Props = {
  open: boolean;
  role: ManagedRole | null;
  form: RoleForm;
  permissions: PermissionOption[];
  saving: boolean;
  error: string;
  onSave: (values: SaveRole) => void;
  onCancel: () => void;
};
export default function RoleEditor({ open, role, form, permissions, saving, error, onSave, onCancel }: Props) {
  const system = role?.name === "admin";
  return (
    <Dialog
      forceRender
      open={open}
      width={760}
      title={role ? `Edit role: ${role.name}` : "Add role"}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={saving}
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
    >
      {error && <Alert className="mb-4" type="error" title={error} showIcon />}
      {system && (
        <Alert
          className="mb-4"
          type="info"
          title="Admin always has all permissions. New permissions are added automatically."
          showIcon
        />
      )}
      <Form form={form} layout="vertical" requiredMark={false} disabled={saving} onFinish={onSave}>
        <Form.Item
          name="name"
          label="Role name"
          rules={[
            { required: true, whitespace: true },
            {
              pattern: /^[a-z][a-z0-9_-]{0,63}$/,
              message: "Use lowercase letters, numbers, underscores or hyphens (max 64).",
            },
          ]}
        >
          <Input disabled={system} maxLength={64} placeholder="support" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 2000 }]}>
          <Input.TextArea rows={3} maxLength={2000} />
        </Form.Item>
        <Form.Item name="permissions" label="Permissions" rules={[{ type: "array" }]}>
          <PermissionPicker options={permissions} disabled={saving || system} />
        </Form.Item>
      </Form>
    </Dialog>
  );
}
