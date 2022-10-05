import { Subtitle } from "."

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