// local dependencies
import _currentInfo from "@/components/contexts/current-info-ctx";

// type
import { Subtitle } from "@/interfaces"
import type {
  c2sChangeUser,
  c2sGetRoomSubtitles,
  c2sChangeSubtitle,
  c2sAddSubtitleUp,
  c2sAddSubtitleDown,
} from "@/interfaces/ws"

export const addUser = (ws: WebSocket) => {
  const _addUser: c2sChangeUser = {
    head: {
      cmd: "changeUser"
    },
    body: {
      uname: _currentInfo.currentUser().user_name
    }
  }
  const addUser = new TextEncoder().encode(JSON.stringify(_addUser))
  ws.send(addUser)
}

export const getRoomSubtitles = (
  ws: WebSocket,
  roomid: string,
) => {
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

export const changeSubtitle = (
  {
    ws,
    subtitle,
  }:{
    ws: WebSocket | undefined
    subtitle: Subtitle
  }
) => {
  if (typeof(ws) === "undefined") {
    window.alert("正在连接到服务器, 请稍等")
    return
  }
  const _postData: c2sChangeSubtitle = {
    head: {
      cmd: "changeSubtitle"
    },
    body: {
      subtitle: subtitle
    }
  }
  const postData = new TextEncoder().encode(JSON.stringify(_postData))
  ws.send(postData)
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
