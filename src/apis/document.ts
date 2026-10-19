import http from "./gateway-http";
export interface ExtractionResult {
  skill_id: number;
  skill_name: string;
  status: "completed" | "failed";
  data?: Record<string, unknown>;
  error?: string;
}
export interface ExtractData {
  type?: string | null;
  skill_ids?: number[];
  results?: ExtractionResult[];
  started_at?: string;
  completed_at?: string;
  [key: string]: unknown;
}
export interface ManagedDocument {
  id: number;
  branch_id?: number | null;
  name: string;
  filename: string;
  url: string;
  content: string;
  state: string | null;
  extract_data: ExtractData | null;
  createdAt?: string;
  updateAt?: string;
}
export interface SaveDocument {
  name: string;
  filename: string;
  url: string;
  content: string;
}
export interface DocumentList {
  items: ManagedDocument[];
  total: number;
  page: number;
  pageSize: number;
}
export interface DocumentUpload extends ManagedDocument {
  key: string;
  size: number;
  isFake: boolean;
}
const path = "/admin/documents";
const payload = (body: SaveDocument) => ({
  name: body.name.trim(),
  filename: body.filename.trim(),
  url: body.url.trim(),
  content: body.content ?? "",
});
export const documentApi = {
  async list(params: { search?: string; page: number; pageSize: number }, signal?: AbortSignal) {
    return (await http.get<DocumentList>(path, { params, signal })).data;
  },
  async detail(id: number) {
    return (await http.get<ManagedDocument>(`${path}/${id}`)).data;
  },
  async create(body: SaveDocument) {
    return (await http.post<ManagedDocument>(path, payload(body))).data;
  },
  async update(id: number, body: SaveDocument) {
    return (await http.patch<ManagedDocument>(`${path}/${id}`, payload(body))).data;
  },
  async remove(id: number) {
    return (await http.delete<{ deleted: boolean }>(`${path}/${id}`)).data;
  },
  async upload(file: File) {
    const data = new FormData();
    data.append("file", file);
    return (await http.post<DocumentUpload>(`${path}/upload`, data)).data;
  },
  async replaceFile(id: number, file: File) {
    const data = new FormData();
    data.append("file", file);
    return (await http.patch<DocumentUpload>(`${path}/${id}/file`, data)).data;
  },
};
