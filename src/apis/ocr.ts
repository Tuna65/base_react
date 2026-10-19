import http from "./gateway-http";

export interface OcrSettings {
  url: string;
  modelName: string;
  hasKey: boolean;
}
export interface SaveOcrSettings {
  url: string;
  modelName: string;
  key?: string;
}
export interface OcrQueueSettings {
  batch_size: number;
  ocr_global_ccu: number;
  llm_global_ccu: number;
  max_attempts: number;
  retry_delay_seconds: number;
  lease_seconds: number;
}
const path = "/admin/ocr/settings";

export const ocrApi = {
  async getQueueSettings() {
    return (await http.get<OcrQueueSettings>("/admin/ocr/queue-settings")).data;
  },
  async saveQueueSettings(body: Partial<OcrQueueSettings>) {
    const payload = { batch_size: body.batch_size, ocr_global_ccu: body.ocr_global_ccu, llm_global_ccu: body.llm_global_ccu, max_attempts: body.max_attempts, retry_delay_seconds: body.retry_delay_seconds, lease_seconds: body.lease_seconds };
    return (await http.put<OcrQueueSettings>("/admin/ocr/queue-settings", payload)).data;
  },
  async getSettings() {
    return (await http.get<OcrSettings>(path)).data;
  },
  async saveSettings(body: SaveOcrSettings) {
    const payload = {
      url: body.url.trim(),
      modelName: body.modelName.trim(),
      ...(body.key?.trim() ? { key: body.key.trim() } : {}),
    };
    return (await http.put<OcrSettings>(path, payload)).data;
  },
};
