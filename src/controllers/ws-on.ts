// local dependencies
import _currentInfo from "@/components/contexts/current-info-ctx";
import { wsSend } from "."

// type
import { Subtitle } from "@/interfaces";
import type {
  FloatingElem,
} from "@/interfaces";
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
) => {
  console.log("ws connected");
  wsSend.addUser(ws)
  wsSend.getRoomSubtitles(ws, roomid)
}
