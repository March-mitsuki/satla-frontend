import { Subtitle } from "."

// c2s -> client to server msg
// s2c -> server to client msg
export interface c2sAddSubtitle {
  head: {
    cmd: "addSubtitle"
  }
  body: {
    data: Subtitle
  }
}

export interface c2sAddUser {
  head: {
    cmd: "addUser"
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

// 先用s2cEventMap判断cmd, 之后再解析body
export interface s2cEventMap {
  head: {
    cmd: "sAddUser" | "sGetRoomSubtitles"
  }
  body: any
}

export interface s2cAddUserBody {
  users: string[]
}

export interface s2cGetRoomSubBody {
  subtitles: Subtitle[]
}