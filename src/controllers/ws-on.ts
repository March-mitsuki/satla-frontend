// local dependencies
import _currentInfo from "@/components/contexts/current-info-ctx";

// type
import { Subtitle } from "@/interfaces";
import type {
  UserInfoFromServer,
  FloatingElem,
} from "@/interfaces";
import type {
  c2sChangeUser,
  c2sGetRoomSubtitles,
} from "@/interfaces/ws"
import type {
  s2cEventMap,
  s2cChangeUserBody,
  s2cGetRoomSubBody,
} from "@/interfaces/ws"
import type { Setter } from "solid-js";

export const addUser = (
  data: s2cEventMap,
  setUserList: Setter<string[]>,
) => {
  const body: s2cChangeUserBody = data.body
  setUserList(body.users)
  console.log("add user msg: ", body);
}

export const getRoomSubtitles = (
  data: s2cEventMap,
  setSubtitles: Setter<Subtitle[] | undefined>,
  setFloatingElem: Setter<FloatingElem[] | undefined>,
) => {
  const body: s2cGetRoomSubBody = data.body
  console.log("get room subtitles msg: ", body);
  const _orderList = body.order.split(',')
  const orderList = _orderList.slice(1,-1)
  body.subtitles.sort((a, b) => {
    return orderList.indexOf(a.id.toString()) - orderList.indexOf(b.id.toString());
  })
  let floatingElem: FloatingElem[] = [];
  for (let i = 0; i < (body.subtitles as Subtitle[]).length; i++) {
    const elem = (body.subtitles as Subtitle[])[i]
    const _floatingElem: FloatingElem = {
      id: elem.id,
      zIndex: "auto",
      position: "static",
      isFloating: false,
      y: 0,
      hidden: false,
      isDrop: false,
    }
    floatingElem.push(_floatingElem)
  }
  setFloatingElem(floatingElem)
  setSubtitles(body.subtitles)
}

export const onopen = (
  ws: WebSocket,
  roomid: string,
  currentUserInfo: UserInfoFromServer,
) => {
  console.log("ws connected");
  const _addUser: c2sChangeUser = {
    head: {
      cmd: "changeUser"
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
