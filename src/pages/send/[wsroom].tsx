// dependencies lib
import { Title } from "@solidjs/meta";
import { createEffect, onCleanup, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { Modal } from "@/components";

// local dependencies
import { FloatingWindowXY } from "@/components";
import { DisplayReview, Navi, SendArea, SendPane } from "@/components/pages";
import rootCtx from "@/components/contexts";
import { wsOn, wsSend } from "@/controllers";

const SendPage = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL;

  const { currentUser, userList, setUserList } = rootCtx.currentUserCtx;
  const { setAttachedInfo, setSubtitles } = rootCtx.subtitlesCtx;
  const { isBatchAdding } = rootCtx.pageTypeCtx;
  const [_ws, setWs] = createSignal<WebSocket>();
  const [isWsconn, setIsWsconn] = createSignal<boolean>(false);

  // 每个page连接不一样的ws room
  const param = useParams<{ wsroom: string }>();
  const url = ws_base_url + param.wsroom;
  const room_id = Number(param.wsroom.split("_")[1]);
  console.log("param here: ", param.wsroom);
  if (isNaN(room_id)) {
    window.alert("错误的url: " + JSON.stringify(param.wsroom.split("_")));
    console.log("wrong params: ", param.wsroom.split("_"));
    return; // eslint-disable-line
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
      wsSend.heartBeat({ ws: ws, roomType: "nomal", roomId: room_id });

      wsOn.onopen(ws, room_id);
      setIsWsconn(true);
    };
    ws.onclose = () => {
      console.log("ws close");
      setIsWsconn(false);
    };
    ws.onerror = (evt) => {
      console.log("ws err", evt);
    };

    const heartBeatTimer = setInterval(() => {
      wsSend.heartBeat({ ws: ws, roomType: "nomal", roomId: room_id });
    }, 1000 * 30);

    onCleanup(() => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
      clearInterval(heartBeatTimer);
      setAttachedInfo(undefined);
      setSubtitles(undefined);
      setUserList(undefined);
    });
  });

  return (
    <>
      <Title>发送页面</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg mb-2 text-xl py-3 px-5">
          <Navi currentProject={param.wsroom} userList={userList()} />
        </div>
        <div class="flex flex-auto pl-2">
          <div class="flex flex-col">
            <FloatingWindowXY
              defaultWindowSize={{
                width: 500,
                height: 200,
              }}
              minWindowSize={{
                width: 435,
                height: 80,
              }}
              wrapperClass="w-[500px] h-[200px] mb-1 flex flex-col"
              controllerWrapperClass="flex justify-between items-center border-x-2 border-t-2 border-gray-500 rounded-t-lg bg-neutral-800"
              floatingControlContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              }
              floatingContent={<div class="select-none">字幕预览区</div>}
              cancelControlContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              contentsWrapperClass="flex flex-col justify-center border-2 border-gray-500 rounded-b-lg flex-auto bg-neutral-700"
              risizerClass="bg-neutral-800 border-l-2 border-t-2 border-gray-500"
            >
              <div class="w-[calc(100%-10px)] truncate">
                <DisplayReview type="nomal" ws={_ws()} wsroom={param.wsroom} />
              </div>
            </FloatingWindowXY>
            <FloatingWindowXY
              defaultWindowSize={{
                width: 500,
                height: "",
              }}
              minWindowSize={{
                width: 500,
                height: 205,
              }}
              wrapperClass="w-[500px] flex flex-col"
              controllerWrapperClass="flex justify-between items-center border-x-2 border-t-2 border-gray-500 rounded-t-lg bg-neutral-800"
              floatingControlContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              }
              floatingContent={<div class="select-none">发送工具</div>}
              cancelControlContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              contentsWrapperClass="border-2 border-gray-500 rounded-b-lg flex-auto bg-neutral-700"
              risizerClass="bg-neutral-800 border-l-2 border-t-2 border-gray-500"
            >
              <SendPane room_id={room_id} wsroom={param.wsroom} ws={_ws()} />
            </FloatingWindowXY>
          </div>
          <div class="flex-auto h-[calc(100vh-70px)]">
            <SendArea room_id={room_id} ws={_ws()} wsroom={param.wsroom} />
          </div>
        </div>
        {isWsconn() === false && (
          <Modal>
            <div class="flex gap-3 justify-center items-center">
              <div>正在连接服务器, 若一直无法连接请检查url是否正确</div>
              <div class="animate-spin h-8 w-8 bg-neutral-400 rounded-xl" />
            </div>
          </Modal>
        )}
        {isBatchAdding() && (
          <Modal>
            <div class="flex gap-3 justify-center items-center">
              <div>正在处理批量添加, 若一直不成功请刷新重试...</div>
              <div class="animate-spin h-8 w-8 bg-neutral-400 rounded-xl" />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default SendPage;
