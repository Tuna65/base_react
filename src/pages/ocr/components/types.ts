import type { Form } from "@/components";
import type { SaveOcrSettings } from "@/apis/ocr";

export type SettingsValues = SaveOcrSettings;
export type OcrForm = ReturnType<typeof Form.useForm<SettingsValues>>[0];
