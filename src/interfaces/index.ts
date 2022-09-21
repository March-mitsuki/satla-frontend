export class Subtitle {
  // 前端用的Subtitle Type
  id: number
  input_time: number
  send_time: number | null // 为null则为未发送
  project_id: number
  project_name: string
  translated_by: string
  checked_by: string | null // 为null则为未校对
  subtitle: string // 翻译
  origin: string // 原文
  is_delete: boolean // 后端逻辑删除用, 发送到前端时的is_delete一定会是false

  constructor() {
    this.id = Date.now()
    this.input_time = -1
    this.send_time = null
    this.project_id = -1
    this.project_name = ""
    this.translated_by = ""
    this.checked_by = null
    this.subtitle = ""
    this.origin = ""
    this.is_delete = false
  }
}

// 前端subtitle配套的附加属性, 用于判断拖动状态
export class FloatingElem {
  id: number
  zIndex: number | "auto"
  position: "static" | "relative" | "absolute" | "sticky" | "fixed"
  isFloating: boolean
  y: number
  hidden: boolean
  isDrop: boolean

  constructor() {
    this.id = Date.now()
    this.zIndex = "auto"
    this.position = "static"
    this.isFloating = false
    this.y = 0
    this.hidden = false
    this.isDrop = false
  }
}

export interface Project {
  project_id: number
  project_name: string
  is_delete: boolean // 后端逻辑删除用, 发送到前端时的is_delete一定会是false
}
