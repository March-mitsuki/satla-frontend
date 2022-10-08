// type
import { Subtitle } from "@/interfaces"
import type {
  UserInfoFromServer,
} from "@/interfaces";
import type {
  c2sAddUser,
  c2sGetRoomSubtitles,
} from "@/interfaces/ws"

export const postChange = (ws: WebSocket, subtitle: Subtitle) => {

}

export const onOpenHandler = (
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