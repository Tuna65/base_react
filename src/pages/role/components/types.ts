import type { Form } from "@/components";
import type { SaveRole } from "@/apis/role";
export type RoleForm = ReturnType<typeof Form.useForm<SaveRole>>[0];
