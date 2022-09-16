export interface Subtitle {
  // 前端用的Subtitle Type
  id: number,
  input_time: number,
  send_time: number | null, // 为null则为未发送
  project_id: number,
  project_name: string,
  slot: 1,
  slot_name: string,
  translated_by: string,
  checked_by: string | null, // 为null则为未校对
  subtitle: string,
  origin: string,
}

export interface SubtitleDB extends Subtitle {
  // 后端保存到DB时用的Subtitle Type
  is_delete: boolean // 逻辑删除用
}