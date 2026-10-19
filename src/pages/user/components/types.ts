import type { Form } from "@/components";
import type { SaveUser } from "@/apis/user";
export type UserForm = ReturnType<typeof Form.useForm<SaveUser>>[0];
export const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  developer: "Developer",
  billing_admin: "Billing Admin",
  auditor: "Auditor",
  user: "User",
};
export const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
