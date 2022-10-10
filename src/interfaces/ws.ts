import { Subtitle } from "."

// c2s -> client to server msg

export interface c2sAddSubtitleUp {
  head: {
    cmd: "addSubtitleUp"
  }
  body: {
    pre_subtitle_id: number
    pre_subtitle_idx: number
    project_id: number
    checked_by: string
  }
}

export interface c2sAddSubtitleDown {
  head: {
    cmd: "addSubtitleDown"
  }
  body: {
    pre_subtitle_id: number
    pre_subtitle_idx: number
    project_id: number
    checked_by: string
  }
}

export interface c2sChangeSubtitle {
  head: {
    cmd: "changeSubtitle"
  }
  body: {
    // 虽然发送整个subtitle, 但是只更新checked_by, subtitle, origin三个要素
    // 之后可以考虑削减发送的数据量来进行性能提升
    subtitle: Subtitle
  }
}

export interface c2sChangeUser {
  head: {
    cmd: "changeUser"
  }
  body: {
    uname: string // username
  }
}

export interface c2sGetRoomSubtitles {
  head: {
    cmd: "getRoomSubtitles"
  }
  body: {
    roomid: string
  }
}

export interface c2sEditStart {
  head: {
    cmd: "editStart"
  }
  body: {
    subtitle_id: number
    uname: string
  }
}

export interface c2sEditEnd {
  head: {
    cmd: "editEnd"
  }
  body: {
    subtitle_id: number
    uname: string
  }
}

export interface c2sAddTranslatedSubtitle {
  head: {
    cmd: "addTransSub"
  }
  body: {
    new_subtitle: Subtitle
    project_name: string
  }
}


// s2c -> server to client msg

export interface s2cEventMap {
  // 先用s2cEventMap判断cmd, 之后再解析body
  head: {
    cmd: 
      "sChangeUser" | "sGetRoomSubtitles" |
      "sAddSubtitleUp" | "sAddSubtitleDown" |
      "sChangeSubtitle" | "sEditStart" | "sEditEnd" |
      "sAddTransSub"
  }
  body: any
}

export interface s2cChangeUserBody {
  users: string[]
}

export interface s2cGetRoomSubBody {
  subtitles: Subtitle[]
  order: string
}

export interface s2cAddSubtitleBody {
  // 无论往上加还是往下加, client需要的body资料都相同
  // 只是通过不同的cmd判断是往上加还是往下加而已
  project_id: number
  new_subtitle_id: number
  pre_subtitle_idx: number
  checked_by: string
}

export interface s2cChangeSubtitleBody {
  // 更改逻辑:
  // 更改字幕 -> 修改本地subtitle -> ws send -> ws on
  status: boolean // 当status === false的时候显示更改失败
  subtitle: Subtitle // change subtitle的时候checked_by一定是当前用户
}

export interface s2cEditChangeBody {
  // body都一样, 只是cmd不同
  subtitle_id: number
  uname: string
}

export interface s2cAddTranslatedSubtitleBody {
  new_subtitle: Subtitle
}
