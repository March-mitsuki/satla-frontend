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
