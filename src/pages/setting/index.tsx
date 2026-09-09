import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Drawer, Empty, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs, Tag, Typography, message } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined, RobotOutlined, BookOutlined, ApiOutlined } from "@ant-design/icons";
import { AgentConfig, ConfigKind, ConfigRecord, FuncallConfig, SkillConfig, settingsApi, settingsError } from "@/apis/settings";

const labels: Record<ConfigKind, string> = { agents: "Agent", skills: "Skill", funcalls: "Funcall" };
const required = [{ required: true, whitespace: true, message: "Vui lòng nhập thông tin." }];

function parseObject(text: unknown, headers = false): Record<string, unknown> {
  let value: unknown;
  try { value = JSON.parse(typeof text === "string" ? text : "{}"); }
  catch { throw new Error("JSON không hợp lệ."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Nhập JSON object, ví dụ: {}.");
  if (headers && Object.values(value).some((entry) => typeof entry !== "string")) throw new Error("Giá trị header phải là chuỗi.");
  return value as Record<string, unknown>;
}

export default function SettingsPage() {
  const [data, setData] = useState<{ agents: AgentConfig[]; skills: SkillConfig[]; funcalls: FuncallConfig[] }>({ agents: [], skills: [], funcalls: [] });
  const [kind, setKind] = useState<ConfigKind>("agents");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ kind: ConfigKind; item?: ConfigRecord }>();
  const [deleting, setDeleting] = useState<{ kind: ConfigKind; item: ConfigRecord }>();
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [form] = Form.useForm();
  const [toast, contextHolder] = message.useMessage();
  const selectedSkillId = Form.useWatch("skill_id", form);
  const selectedSkill = data.skills.find((skill) => skill.id === selectedSkillId);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await settingsApi.load()); setError(""); }
    catch (failure) { setError(settingsError(failure)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function openEditor(item?: ConfigRecord) {
    form.resetFields();
    const values: Record<string, unknown> = item ? { ...item } : { method: "POST", timeout: 30, funcall_ids: [], headers: "{}", query: "{}", parameters: "{}" };
    if (item && "funcalls" in item) values.funcall_ids = item.funcalls.map((funcall) => funcall.id);
    if (item && "url" in item) for (const key of ["headers", "query", "parameters"] as const) values[key] = JSON.stringify(item[key], null, 2);
    form.setFieldsValue(values);
    setEditing({ kind, item });
  }

  async function save(values: Record<string, unknown>) {
    if (!editing) return;
    setSaving(true);
    try {
      let payload: Record<string, unknown>;
      if (editing.kind === "agents") payload = { agent_id: values.agent_id, description: values.description ?? "", skill_id: values.skill_id ?? null, funcall_ids: values.funcall_ids ?? [] };
      else if (editing.kind === "skills") payload = { name: values.name, description: values.description ?? "", system_prompt: values.system_prompt };
      else payload = { name: values.name, description: values.description ?? "", url: values.url, method: values.method, timeout: values.timeout, headers: parseObject(values.headers, true), query: parseObject(values.query), parameters: parseObject(values.parameters) };
      await settingsApi.save(editing.kind, payload, editing.item?.id);
      setEditing(undefined);
      void toast.success("Đã lưu cấu hình.");
      await load();
    } catch (failure) { void toast.error(settingsError(failure)); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!deleting) return;
    setRemoving(true);
    try { await settingsApi.remove(deleting.kind, deleting.item.id); setDeleting(undefined); void toast.success("Đã xóa cấu hình."); await load(); }
    catch (failure) { void toast.error(settingsError(failure)); }
    finally { setRemoving(false); }
  }

  const rows = useMemo(() => (data[kind] as ConfigRecord[]).filter((item) => {
    const name = "agent_id" in item ? item.agent_id : item.name;
    return `${name} ${item.description ?? ""}`.toLowerCase().includes(search.toLowerCase());
  }), [data, kind, search]);
  const columns = [
    { title: kind === "agents" ? "Agent ID" : "Tên", key: "name", render: (_: unknown, item: ConfigRecord) => <div><Typography.Text strong>{"agent_id" in item ? item.agent_id : item.name}</Typography.Text><div className="mt-1 max-w-sm text-xs text-slate-500">{item.description || "Chưa có mô tả"}</div></div> },
    ...(kind === "agents" ? [
      { title: "Skill", key: "skill", render: (_: unknown, item: ConfigRecord) => <Tag color="blue">{(item as AgentConfig).skill?.name ?? "Chưa gán"}</Tag> },
      { title: "Funcall", key: "funcalls", render: (_: unknown, item: ConfigRecord) => <Space size={[0, 4]} wrap>{(item as AgentConfig).funcalls.length ? (item as AgentConfig).funcalls.map((f) => <Tag key={f.id}>{f.name}</Tag>) : <Typography.Text type="secondary">Không có</Typography.Text>}</Space> },
    ] : kind === "skills" ? [
      { title: "System prompt", key: "prompt", render: (_: unknown, item: ConfigRecord) => <Typography.Paragraph ellipsis={{ rows: 2 }} className="!mb-0 max-w-lg">{(item as SkillConfig).system_prompt}</Typography.Paragraph> },
    ] : [
      { title: "HTTP endpoint", key: "url", render: (_: unknown, item: ConfigRecord) => <div className="max-w-lg break-all"><Tag color="geekblue">{(item as FuncallConfig).method}</Tag>{(item as FuncallConfig).url}</div> },
      { title: "Timeout", key: "timeout", render: (_: unknown, item: ConfigRecord) => `${(item as FuncallConfig).timeout}s` },
    ]),
    { title: "Thao tác", key: "actions", width: 150, render: (_: unknown, item: ConfigRecord) => <Space><Button type="link" disabled={loading || !!error} onClick={() => openEditor(item)}>Sửa</Button><Button type="link" danger disabled={loading || !!error} onClick={() => setDeleting({ kind, item })}>Xóa</Button></Space> },
  ];

  return <div className="mx-auto max-w-[1400px] space-y-6">
    {contextHolder}
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><Typography.Title level={3} className="!mb-1">Cài đặt agent</Typography.Title><Typography.Text type="secondary">Quản lý skill, công cụ và cách gán chúng cho từng agent.</Typography.Text></div>
      <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void load()}>Tải lại</Button>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {(["agents", "skills", "funcalls"] as const).map((tab, index) => <Card key={tab} size="small"><div className="flex items-center gap-4"><div className="rounded-xl bg-blue-50 p-3 text-xl text-blue-600">{[<RobotOutlined key="a" />, <BookOutlined key="s" />, <ApiOutlined key="f" />][index]}</div><div><div className="text-sm text-slate-500">{labels[tab]}</div><div className="text-2xl font-semibold text-slate-800">{loading || error ? "—" : data[tab].length}</div></div></div></Card>)}
    </div>
    {error && <Alert type="error" showIcon title="Không tải được cấu hình" description={error} action={<Button onClick={() => void load()}>Thử lại</Button>} />}
    <Card>
      <Tabs activeKey={kind} onChange={(key) => { setKind(key as ConfigKind); setSearch(""); }} items={(["agents", "skills", "funcalls"] as const).map((tab) => ({ key: tab, label: labels[tab] }))} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><Input aria-label="Tìm cấu hình" className="!max-w-sm" prefix={<SearchOutlined />} placeholder="Tìm theo tên hoặc mô tả" allowClear value={search} onChange={(e) => setSearch(e.target.value)} /><Button type="primary" icon={<PlusOutlined />} disabled={loading || !!error} onClick={() => openEditor()}>Thêm {labels[kind]}</Button></div>
      <Table<ConfigRecord> rowKey="id" loading={loading} columns={columns} dataSource={rows} scroll={{ x: 760 }} pagination={{ pageSize: 10, hideOnSinglePage: true }} locale={{ emptyText: <Empty description={search ? "Không tìm thấy cấu hình phù hợp" : `Chưa có ${labels[kind].toLowerCase()} nào`} /> }} />
    </Card>
    <Drawer title={`${editing?.item ? "Chỉnh sửa" : "Thêm"} ${editing ? labels[editing.kind] : ""}`} open={!!editing} onClose={() => { if (!saving) setEditing(undefined); }} size={620} maskClosable={!saving} closable={!saving} forceRender footer={<div className="flex justify-end gap-2"><Button disabled={saving} onClick={() => setEditing(undefined)}>Hủy</Button><Button type="primary" loading={saving} onClick={() => form.submit()}>Lưu cấu hình</Button></div>}>
      <Form form={form} layout="vertical" onFinish={(values) => void save(values)} disabled={saving}>
        {editing?.kind === "agents" ? <>
          <Form.Item name="agent_id" label="Agent ID" rules={[...required, { max: 255 }]}><Input placeholder="documents.markdown" /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="skill_id" label="Skill (không bắt buộc)" extra="Có thể để trống hoặc chọn một skill. Nhấn dấu × để bỏ skill đã gán."><Select allowClear showSearch optionFilterProp="label" placeholder="Không sử dụng skill" options={data.skills.map((s) => ({ value: s.id, label: s.name }))} /></Form.Item>
          {selectedSkill && <div className="mb-5 rounded-lg bg-slate-50 p-3"><div className="mb-2 text-xs font-semibold text-slate-500">PROMPT CỦA SKILL</div><Typography.Paragraph className="!mb-0 whitespace-pre-wrap" ellipsis={{ rows: 4, expandable: true, symbol: "Xem thêm" }}>{selectedSkill.system_prompt}</Typography.Paragraph></div>}
          <Form.Item name="funcall_ids" label="Funcall" extra="Chọn nhiều công cụ hoặc để trống nếu agent không cần gọi HTTP."><Select mode="multiple" allowClear optionFilterProp="label" placeholder="Chọn funcall" options={data.funcalls.map((f) => ({ value: f.id, label: `${f.name} · ${f.method}` }))} /></Form.Item>
        </> : <>
          <Form.Item name="name" label="Tên" rules={[...required, { max: 255 }]}><Input /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} /></Form.Item>
          {editing?.kind === "skills" ? <Form.Item name="system_prompt" label="System prompt" rules={required}><Input.TextArea rows={12} placeholder="Nhập hướng dẫn cho agent…" /></Form.Item> : <>
            <Form.Item name="url" label="URL" rules={[...required, { validator: async (_, value) => { try { if (!["http:", "https:"].includes(new URL(value).protocol)) throw new Error(); } catch { throw new Error("Nhập URL HTTP hoặc HTTPS hợp lệ."); } } }]}><Input placeholder="https://api.example.com/documents" /></Form.Item>
            <div className="grid grid-cols-2 gap-4"><Form.Item name="method" label="HTTP method" rules={[{ required: true }]}><Select options={["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map((value) => ({ value, label: value }))} /></Form.Item><Form.Item name="timeout" label="Timeout (giây)" rules={[{ required: true }, { type: "number", min: 0.001 }]}><InputNumber min={0.001} className="!w-full" /></Form.Item></div>
            {(["headers", "query", "parameters"] as const).map((key) => <Form.Item key={key} name={key} label={`${key} (JSON)`} rules={[{ validator: async (_, value) => { parseObject(value, key === "headers"); } }]}><Input.TextArea rows={key === "parameters" ? 5 : 3} spellCheck={false} /></Form.Item>)}
          </>}
        </>}
      </Form>
    </Drawer>
    <Modal title={`Xóa ${deleting ? labels[deleting.kind] : "cấu hình"}?`} open={!!deleting} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }} confirmLoading={removing} cancelButtonProps={{ disabled: removing }} closable={!removing} maskClosable={!removing} onCancel={() => { if (!removing) setDeleting(undefined); }} onOk={() => void remove()}>
      <p className="mb-3">Bạn muốn xóa <strong>{deleting && ("agent_id" in deleting.item ? deleting.item.agent_id : deleting.item.name)}</strong>?</p>
      <Typography.Text type="secondary">{deleting?.kind === "skills" ? "Skill đang được agent sử dụng sẽ không thể xóa. Hãy đổi skill của agent trước." : deleting?.kind === "funcalls" ? "Funcall sẽ được gỡ khỏi các agent đang sử dụng. Thao tác này không thể hoàn tác." : "Agent sẽ bị xóa cùng các liên kết. Skill và funcall vẫn được giữ lại."}</Typography.Text>
    </Modal>
  </div>;
}
