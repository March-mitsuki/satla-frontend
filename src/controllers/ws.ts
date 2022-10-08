// type
import { Subtitle } from "@/interfaces";
import type {
  UserInfoFromServer,
} from "@/interfaces";
import type {
  c2sAddUser,
  c2sGetRoomSubtitles,
  s2cEventMap,
  s2cAddUserBody,
} from "@/interfaces/ws"
import type { Setter } from "solid-js";

export const wsAddUserHandler = (
  data: s2cEventMap,
  setUserList: Setter<string[]>,
  setSubtitles: Setter<Subtitle[] | undefined>,
) => {
  const body: s2cAddUserBody = data.body
  setUserList(body.users)
  setSubtitles(body.subtitles)
  console.log("add user msg: ", body);
}

export const wsOnopenHandler = (
  ws: WebSocket,
  roomid: string,
  currentUserInfo: UserInfoFromServer,
) => {
  console.log("ws connected");
  const _addUser: c2sAddUser = {
    head: {
      cmd: "addUser"
    },
    body: {
      uname: currentUserInfo.name
    }
  }
  const addUser = new TextEncoder().encode(JSON.stringify(_addUser))
  ws.send(addUser)
  const _getRoomSubtitles: c2sGetRoomSubtitles = {
    head: {
      cmd: "getRoomSubtitles"
    },
    body: {
      roomid: roomid
    }
  }
  const getRoomSubtitles = new TextEncoder().encode(JSON.stringify(_getRoomSubtitles))
  ws.send(getRoomSubtitles)
}