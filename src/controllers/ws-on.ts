// local dependencies
import _currentInfo from "@/components/contexts/current-info-ctx";
import { wsSend } from "."

// type
import { Subtitle } from "@/interfaces";
import { AttachedInfo } from "@/interfaces";
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
  setAttachedInfo: Setter<AttachedInfo[] | undefined>,
) => {
  const body: s2cGetRoomSubBody = data.body
  console.log("get room subtitles msg: ", body);
  const _orderList = body.order.split(',')
  const orderList = _orderList.slice(1,-1)
  body.subtitles.sort((a, b) => {
    return orderList.indexOf(a.id.toString()) - orderList.indexOf(b.id.toString());
  })
  let attachedInfo: AttachedInfo[] = [];
  for (let i = 0; i < (body.subtitles as Subtitle[]).length; i++) {
    const elem = (body.subtitles as Subtitle[])[i]
    const _attachedInfo = new AttachedInfo(elem.id)
    attachedInfo.push(_attachedInfo)
  }
  setAttachedInfo(attachedInfo)
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
