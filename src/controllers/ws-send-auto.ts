// type
import { AutoSub } from "@/interfaces/autoplay";
import {
  c2sAddAutoSub,
  c2sDeleteAutoSub,
  c2sGetRoomAutoLists,
  c2sPlayEnd,
  c2sPlayForward,
  c2sPlayForwardTwice,
  c2sPlayPause,
  c2sPlayRestart,
  c2sPlayRewind,
  c2sPlayRewindTwice,
  c2sPlaySendBlank,
  c2sPlayStart,
  c2sGetAutoPlayStat,
  c2sRecoverAutoPlayStat,
  c2sChangeAutoMemo,
} from "@/interfaces/ws-auto";

export const getRoomAutoList = ({
  ws,
  room_id,
}: {
  ws: WebSocket | undefined;
  room_id: number;
}) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sGetRoomAutoLists = {
    head: {
      cmd: "getRoomAutoLists",
    },
    body: {
      room_id: room_id,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const addAutoSub = ({
  ws,
  autoSubs,
  memo,
}: {
  ws: WebSocket | undefined;
  autoSubs: AutoSub[];
  memo: string;
}) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sAddAutoSub = {
    head: {
      cmd: "addAutoSub",
    },
    body: {
      auto_subs: autoSubs,
      memo: memo,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayStart = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayStart = {
    head: {
      cmd: "playStart",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayEnd = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayEnd = {
    head: {
      cmd: "playEnd",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayForward = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayForward = {
    head: {
      cmd: "playForward",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayForwardTwice = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayForwardTwice = {
    head: {
      cmd: "playForwardTwice",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayRewind = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayRewind = {
    head: {
      cmd: "playRewind",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayRewindTwice = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayRewindTwice = {
    head: {
      cmd: "playRewindTwice",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayPause = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayPause = {
    head: {
      cmd: "playPause",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlayRestart = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlayRestart = {
    head: {
      cmd: "playRestart",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const autoPlaySendBlank = (ws: WebSocket | undefined) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sPlaySendBlank = {
    head: {
      cmd: "playSendBlank",
    },
    body: {
      data: {},
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const deleteAutoList = (ws: WebSocket | undefined, listId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sDeleteAutoSub = {
    head: {
      cmd: "deleteAutoSub",
    },
    body: {
      list_id: listId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const getAutoPlayStat = (ws: WebSocket | undefined) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sGetAutoPlayStat = {
    head: {
      cmd: "getAutoPlayStat",
    },
    body: {
      data: {},
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const recoverAutoPlayStat = (ws: WebSocket | undefined, roomId: number) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sRecoverAutoPlayStat = {
    head: {
      cmd: "recoverAutoPlayStat",
    },
    body: {
      room_id: roomId,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};

export const changeAutoMemo = (ws: WebSocket | undefined, listId: number, memo: string) => {
  if (typeof ws === "undefined" || ws.readyState === ws.CLOSED) {
    // window.alert("正在连接到服务器, 请稍等")
    console.log("ws is closed or not connected, please wait");
    return;
  }
  const _postData: c2sChangeAutoMemo = {
    head: {
      cmd: "changeAutoMemo",
    },
    body: {
      list_id: listId,
      memo: memo,
    },
  };
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};
