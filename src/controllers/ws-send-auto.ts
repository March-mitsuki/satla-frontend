// type
import { AutoSub } from "@/interfaces/autoplay";
import { c2sAddAutoSub, c2sGetRoomAutoLists, c2sPlayStart } from "@/interfaces/ws-auto";

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
  console.log("start auto play: ", _postData);
  const postData = new TextEncoder().encode(JSON.stringify(_postData));
  ws.send(postData);
  return;
};
