export interface SubtitleDB extends Subtitle {
  // 后端保存到DB时用的Subtitle Type
  is_delete: boolean // 逻辑删除用
}

export class Subtitle {
  // 前端用的Subtitle Type
  id: number
  input_time: number
  send_time: number | null // 为null则为未发送
  project_id: number
  project_name: string
  room_name: string
  translated_by: string
  checked_by: string | null // 为null则为未校对
  subtitle: string
  origin: string

  constructor() {
    this.id = Date.now()
    this.input_time = -1
    this.send_time = null
    this.project_id = -1
    this.project_name = ""
    this.room_name = ""
    this.translated_by = ""
    this.checked_by = null
    this.subtitle = ""
    this.origin = ""
  }
}

// 前端和subtitle配套的附加属性, 用于判断拖动状态
export type FloatingElem = {
  id: number,
  zIndex: number | "auto",
  position: "static" | "relative" | "absolute" | "sticky" | "fixed",
  isFloating: boolean,
  y: number,
  hidden: boolean,
  isDrop: boolean,
}
