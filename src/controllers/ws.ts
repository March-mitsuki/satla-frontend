// type
import { Subtitle } from "@/interfaces";
import type {
  UserInfoFromServer,
  FloatingElem,
} from "@/interfaces";
import type {
  c2sChangeUser,
  c2sGetRoomSubtitles,
  c2sAddSubtitleUp,
  c2sAddSubtitleDown,
} from "@/interfaces/ws"
import type {
  s2cEventMap,
  s2cChangeUserBody,
  s2cGetRoomSubBody,
} from "@/interfaces/ws"
import type { Setter } from "solid-js";
import _currentInfo from "@/components/contexts/current-info-ctx";

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

export const addSubtitleUp = (
  {
    ws,
    id,
    idx,
    project_id,
  }:{
    ws: WebSocket | undefined,
    id: number,
    idx: number,
    project_id: number,
  }
) => {
  if (typeof(ws) === "undefined") {
    window.alert("正在连接到服务器, 请稍等")
    return
  }
  const _postData: c2sAddSubtitleUp = {
    head: {
      cmd: "addSubtitleUp"
    },
    body: {
      pre_subtitle_id: id,
      pre_subtitle_idx: idx,
      project_id: project_id,
      checked_by: _currentInfo.currentUser().user_name
    }
  }
  const postData = new TextEncoder().encode(JSON.stringify(_postData))
  ws.send(postData)
  console.log("add subtitle up: ", _postData);
}

export const addSubtitleDown = (
  {
    ws,
    id,
    idx,
    project_id,
  }:{
    ws: WebSocket | undefined,
    id: number,
    idx: number,
    project_id: number,
  }
) => {
  if (typeof(ws) === "undefined") {
    window.alert("正在连接到服务器, 请稍等")
    return
  }
  const _postData: c2sAddSubtitleDown = {
    head: {
      cmd: "addSubtitleDown"
    },
    body: {
      pre_subtitle_id: id,
      pre_subtitle_idx: idx,
      project_id: project_id,
      checked_by: _currentInfo.currentUser().user_name
    }
  }
  const postData = new TextEncoder().encode(JSON.stringify(_postData))
  ws.send(postData)
  console.log("send subtitle down: ", _postData);
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
