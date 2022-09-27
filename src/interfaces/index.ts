export class Subtitle {
  // 前端用的Subtitle Type
  id: number
  input_time: string // 行左边显示的时间
  send_time: Date | number | null // 为null则为未发送
  project_id: number
  project_name: string
  translated_by: string
  checked_by: string | null // 为null则为未校对
  subtitle: string // 翻译
  origin: string // 原文
  deleted_at: Date | null // 后端逻辑删除用, 发送到前端时的is_delete一定会是false

  constructor() {
    this.id = Date.now()
    this.input_time = "11:34:30"
    this.send_time = null
    this.project_id = -1
    this.project_name = ""
    this.translated_by = ""
    this.checked_by = null
    this.subtitle = ""
    this.origin = ""
    this.deleted_at = null
  }
}

// 服务器传回来的数据example
// map[
//   checked_by: 
//   created_at:2022-09-25 01:08:23.934 +0000 UTC
//   deleted_at:<nil> 
//   id:1 
//   input_time:12:32:40 
//   origin: 
//   project_id:1 
//   project_name:default 
//   send_time:2022-09-25 01:08:23.933 +0000 UTC 
//   subtitle: 
//   translated_by:三月 
//   updated_at:2022-09-25 01:08:23.934 +0000 UTC
// ]

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
  id: number
  project_name: string
  description: string
  point_man: string
  created_by: string
  deleted_at: Date | null // 后端逻辑删除用, 发送到前端时的is_delete一定会是false
}

// Project的example, 不指定model直接返回的结果
// {
//   {1 2022-09-25 02:58:51.505 +0000 UTC 2022-09-25 02:58:51.505 +0000 UTC {0001-01-01 00:00:00 +0000 UTC false}}
//   default 默认项目 三月 三月
// } 

export interface PostSubtitle {
  head: {
    cmd: "addSubtitle"
  }
  body: {
    data: Subtitle
  }
}

export interface PostAddUser {
  head: {
    cmd: "addUser"
  }
  body: {
    data: string
  }
}
