export class Subtitle {
  // 前端用的Subtitle Type
  id: number
  input_time: string // 行左边显示的时间
  send_time: Date | null // 为null则为未发送
  project_id: number
  translated_by: string
  checked_by: string // 为空字符串则为未校对
  subtitle: string // 翻译
  origin: string // 原文

  constructor(
    {
      id,
      project_id,
      translated_by,
      checked_by
    }:{
      id: number,
      project_id: number,
      translated_by: string,
      checked_by?: string 
    }
  ){
    if (checked_by) {
      this.checked_by = checked_by
    } else {
      this.checked_by = ""
    }

    this.id = id
    this.project_id = project_id
    this.translated_by = translated_by

    this.input_time = "00:00:00"
    this.send_time = null
    this.subtitle = ""
    this.origin = ""
  }
}

// 前端subtitle配套的附加属性
// 用于判断拖动状态, 是否在编辑, 更改是否成功等
export class AttachedInfo {
  id: number
  zIndex: number | "auto"
  position: "static" | "relative" | "absolute" | "sticky" | "fixed"
  isFloating: boolean
  y: number
  hidden: boolean
  isDrop: boolean
  isEditing: boolean
  changeStatus: boolean

  constructor(id: number) {
    this.id = id
    this.zIndex = "auto"
    this.position = "static"
    this.isFloating = false
    this.y = 0
    this.hidden = false
    this.isDrop = false
    this.isEditing = false
    this.changeStatus = true // 初始为ture, 当为false的时候说明改行更改失败
  }
}

export interface SignupUser {
  user_name: string
  email: string
  password: string
}

export interface LoginUser {
  email: string
  password: string
}

export interface UserInfoFromServer {
  id: number
  user_name: string
  email: string
}

interface DataFromServerHead {
  id: number
  created_at: any
  updated_at: any
  deleted_at: any
}

export interface Project {
  project_name: string
  description: string
  point_man: string
  created_by: string
}

export interface ProjectFromServer extends DataFromServerHead, Project {}

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

export interface NewProjectResponseBody {
  code: -1 | 0
  status: 2000 | 5303
  msg: string
}
