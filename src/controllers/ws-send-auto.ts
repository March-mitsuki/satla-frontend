// type
import { AutoSub } from "@/interfaces/autoplay";
import {
  c2sAddAutoSub,
  c2sGetRoomAutoLists,
  c2sPlayEnd,
  c2sPlayForward,
  c2sPlayForwardTwice,
  c2sPlayPause,
  c2sPlayRestart,
  c2sPlayRewind,
  c2sPlayRewindTwice,
  c2sPlayStart,
} from "@/interfaces/ws-auto";

export const getRoomAutoList = ({ ws, room_id }: { ws: WebSocket; room_id: number }) => {
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
  ws: WebSocket;
  autoSubs: AutoSub[];
  memo: string;
}) => {
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

export const autoPlayStart = (ws: WebSocket, listId: number) => {
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

export const autoPlayEnd = (ws: WebSocket, listId: number) => {
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

export const autoPlayForward = (ws: WebSocket, listId: number) => {
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

export const autoPlayForwardTwice = (ws: WebSocket, listId: number) => {
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

export const autoPlayRewind = (ws: WebSocket, listId: number) => {
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

export const autoPlayRewindTwice = (ws: WebSocket, listId: number) => {
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

export const autoPlayPause = (ws: WebSocket, listId: number) => {
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

export const autoPlayRestart = (ws: WebSocket, listId: number) => {
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
