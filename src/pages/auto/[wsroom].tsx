// dependencies lib
import { useParams } from "@solidjs/router";
import { createEffect, onCleanup, createSignal } from "solid-js";
import { Title } from "@solidjs/meta";

// local dependencies
import { wsAutoSend, wsSend } from "@/controllers";
import { Modal } from "@/components";
import {
  AutoNavi,
  AutoPreview,
  AssUploader,
  Operation,
  OperationBlank,
  StylePreviewPane,
} from "@/components/pages/auto";
import rootCtx from "@/components/contexts";
import AutoStyleChanger from "@/components/pages/auto/operation-style-changer";

const AutoPlay = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL;
  const { currentUser, userList, setUserList } = rootCtx.currentUserCtx;
  const [_ws, setWs] = createSignal<WebSocket>();
  const [isWsconn, setIsWsconn] = createSignal<boolean>(false);

  // 每个page连接不一样的ws room
  const param = useParams<{ wsroom: string }>();
  const url = ws_base_url + param.wsroom;
  const room_id = Number(param.wsroom.split("_")[1]);
  if (isNaN(room_id)) {
    window.alert("错误的url: " + JSON.stringify(param.wsroom.split("_")));
    console.log("wrong params: ", param.wsroom.split("_"));
    return;
  }

  createEffect(() => {
    if (currentUser().id === -1) {
      return;
    }
    console.log("now data fetched", currentUser());
    setWs(new WebSocket(url));
    const ws = _ws();
    if (!ws) {
      console.log("send page ws is undefined");
      return;
    }
    ws.onopen = () => {
      console.log("ws connect");
      setIsWsconn(true);
      wsAutoSend.getRoomAutoList({
        ws: ws,
        room_id: room_id,
      });
      wsSend.addUser(ws);
    };
    ws.onclose = () => {
      console.log("ws close");
      setIsWsconn(false);
    };
    ws.onerror = (evt) => {
      console.log("ws err", evt);
    };

    const heartBeatTimer = setInterval(() => {
      wsSend.heartBeat(ws);
    }, 1000 * 30);

    onCleanup(() => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
      clearInterval(heartBeatTimer);
      setUserList(undefined);
    });
  });

  return (
    <>
      <Title>Auto Player</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="mb-2 text-xl py-3 px-5">
          <AutoNavi userList={userList()}></AutoNavi>
        </div>
        <div class="sticky border-t-2 shadow-lg flex items-center">
          <AutoPreview ws={_ws()}></AutoPreview>
        </div>
        <div class="py-3 px-5 flex gap-5 items-center justify-center">
          <AssUploader ws={_ws()} room_id={room_id}></AssUploader>
          <div class="h-8 w-[2px] bg-gray-400 rounded-full"></div>
          <button
            class="h-full items-center gap-1 px-2 py-1 rounded-md bg-green-500/70 hover:bg-green-700/70 "
            onClick={() => window.open(`/auto/display/${param.wsroom}`, "_blank")}
          >
            打开视窗
          </button>
          <div class="h-8 w-[2px] bg-gray-400 rounded-full"></div>
          <AutoStyleChanger ws={_ws()} wsroom={param.wsroom}></AutoStyleChanger>
          <div class="h-8 w-[2px] bg-gray-400 rounded-full"></div>
          <StylePreviewPane ws={_ws()}></StylePreviewPane>
          <div class="h-8 w-[2px] bg-gray-400 rounded-full"></div>
          <OperationBlank ws={_ws()}></OperationBlank>
        </div>
        <div class="py-3 px-5 flex gap-5 items-center justify-center w-full">
          <Operation ws={_ws()}></Operation>
        </div>
        {isWsconn() === false && (
          <Modal>
            <div class="flex gap-3 justify-center items-center">
              <div>正在连接服务器, 若一直无法连接请刷新重试</div>
              <div class="animate-spin h-8 w-8 bg-neutral-400 rounded-xl"></div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default AutoPlay;
