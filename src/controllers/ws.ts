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
  s2cGetRoomSubBody,
} from "@/interfaces/ws"
import type { Setter } from "solid-js";

export const addUserHandler = (
  data: s2cEventMap,
  setUserList: Setter<string[]>,
) => {
  const body: s2cAddUserBody = data.body
  setUserList(body.users)
  console.log("add user msg: ", body);
}

export const getRoomSubHandler = (
  data: s2cEventMap,
  setSubtitles: Setter<Subtitle[] | undefined>
) => {
  const body: s2cGetRoomSubBody = data.body
  setSubtitles(body.subtitles)
  console.log("get room subtitles msg: ", body);
}

export const onopenHandler = (
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
      uname: currentUserInfo.user_name
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
