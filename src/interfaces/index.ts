export class Subtitle {
  // 前端用的Subtitle Type
  id: number;
  input_time: string; // 行左边显示的时间
  send_time: Date | null; // 为null则为未发送
  room_id: number;
  translated_by: string;
  checked_by: string; // 为空字符串则为未校对
  send_by: string;
  subtitle: string; // 翻译
  origin: string; // 原文

  constructor({
    id,
    room_id,
    translated_by,
    checked_by,
    subtitle,
    origin,
    input_time,
    send_by,
  }: {
    id: number;
    room_id: number;
    translated_by: string;
    checked_by?: string;
    subtitle?: string;
    origin?: string;
    input_time?: string;
    send_by?: string;
  }) {
    if (checked_by) {
      this.checked_by = checked_by;
    } else {
      this.checked_by = "";
    }
    if (subtitle) {
      this.subtitle = subtitle;
    } else {
      this.subtitle = "";
    }
    if (origin) {
      this.origin = origin;
    } else {
      this.origin = "";
    }
    if (input_time) {
      this.input_time = input_time;
    } else {
      this.input_time = "00:00:00";
    }
    if (send_by) {
      this.send_by = send_by;
    } else {
      this.send_by = "";
    }

    this.id = id;
    this.room_id = room_id;
    this.translated_by = translated_by;

    this.send_time = null;
  }
}

// 前端subtitle配套的附加属性
// 用于判断拖动状态, 是否在编辑, 更改是否成功等
export class AttachedInfo {
  id: number;
  zIndex: number | "auto";
  position: "static" | "relative" | "absolute" | "sticky" | "fixed";
  isFloating: boolean;
  y: number;
  hidden: boolean;
  isDrop: boolean;
  isEditing: boolean;
  editingUser: string;
  changeStatus: 0 | 1 | 2; // 0 -> 正常, 1 -> 未提交, 2 -> 错误

  constructor(id: number) {
    this.id = id;
    this.zIndex = "auto";
    this.position = "static";
    this.isFloating = false;
    this.y = 0;
    this.hidden = false;
    this.isDrop = false;
    this.isEditing = false;
    this.editingUser = "";
    this.changeStatus = 0; // 服务器传回来的changeStatus为bool, 因为是否提交后端不需要知道
  }
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface UserInfoFromServer {
  id: number;
  user_name: string;
  email: string;
  permission: 0 | 1 | 2; // 0 -> test account, 1 -> nomal account, 2 -> administorator
}

export interface Project {
  id: number;
  project_name: string;
  description: string;
  point_man: string;
  created_by: string;
}

export interface ErrJsonRes {
  code: 0 | -1;
  status: number;
  msg: string;
}

export interface RoomData {
  id: number;
  project_id: number;
  room_name: string;
  room_type: number; // 1 -> nomal, 2 -> auto
  description: string;
}

// 2000番 -> 成功
// 4000番 -> 请求不正确
//   4100番 -> login相关, 4200番 -> signup相关
// 5000番 -> 服务端出错
//   5100番 -> login相关, 5200番 -> signup相关
export interface LoginResponseBody {
  code: -1 | 0; // -1 -> 失败, 0 -> 成功
  status: 2000 | 4101 | 4102 | 5101 | 5102;
  // 4101 -> 使用未注册的用户登录
  // 4102 -> 登录时密码错误
  // 5101 -> client储存session失败
  // 5102 -> 登录时redis set session error
  msg: string;
}

export interface SignupResponseBody {
  code: -1 | 0; // -1 -> 失败, 0 -> 成功
  status: 2000 | 4201 | 5201 | 5202;
  // 4201 -> 已存在该用户
  // 5201 -> 暗号化密码失败
  // 5202 -> db创建用户失败
  msg: string;
}

export interface NewProjectResponseBody {
  code: -1 | 0;
  status: 2000 | 5303;
  msg: string;
}

export interface ChangePassword {
  id: number;
  user_name: string;
  email: string;
  old_password: string;
  new_password: string;
}

export interface ChangePassRespBody {
  code: -1 | 0;
  status: 2000 | 5302 | 5305;
  msg: string;
}
