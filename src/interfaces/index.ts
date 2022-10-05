export class Subtitle {
  // 前端用的Subtitle Type
  id: number
  input_time: string // 行左边显示的时间
  send_time: Date | number // 为-1则为未发送
  project_id: number
  project_name: string
  translated_by: string
  checked_by: string // 为空字符串则为未校对
  subtitle: string // 翻译
  origin: string // 原文

  constructor() {
    this.id = Date.now()
    this.input_time = "11:34:30"
    this.send_time = -1
    this.project_id = -1
    this.project_name = ""
    this.translated_by = ""
    this.checked_by = ""
    this.subtitle = ""
    this.origin = ""
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
}

// Project的example, 不指定model直接返回的结果
// {
//   {1 2022-09-25 02:58:51.505 +0000 UTC 2022-09-25 02:58:51.505 +0000 UTC {0001-01-01 00:00:00 +0000 UTC false}}
//   default 默认项目 三月 三月
// } 

export interface SignupUser {
  user_name: string
  email: string
  password: string
}

export interface LoginUser {
  email: string
  password: string
}

// 2000番 -> 成功
// 4000番 -> 请求不正确
//   4100番 -> login相关, 4200番 -> signup相关
// 5000番 -> 服务端出错
//   5100番 -> login相关, 5200番 -> signup相关
export interface LoginResponseBody {
  code: -1 | 0 // -1 -> 失败, 0 -> 成功
  status: 2000 | 4101 | 4102 | 5101 | 5102
  // 4101 -> 使用未注册的用户登录
  // 4102 -> 登录时密码错误
  // 5101 -> client储存session失败
  // 5102 -> 登录时redis set session error
  msg: string
}

export interface SignupResponseBody {
  code: -1 | 0 // -1 -> 失败, 0 -> 成功
  status: 2000 | 4201 | 5201 | 5202
  // 4201 -> 已存在该用户
  // 5201 -> 暗号化密码失败
  // 5202 -> db创建用户失败
  msg: string
}
