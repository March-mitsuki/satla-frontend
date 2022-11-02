// dependencies lib
import { Title } from "@solidjs/meta";
import { createEffect, onCleanup, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { Modal } from "@/components";

// local dependencies
import { FloatingWindow } from "@/components";
import { DisplayReview, Navi, SendArea, SendPane } from "@/components/pages";
import _currentInfo from "@/components/contexts/current-info-ctx";
import _subtitles from "@/components/contexts/subtitles";
import { wsOn, wsSend } from "@/controllers";

const SendPage = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL;

  const { currentUser, userList, setUserList } = _currentInfo;
  const { setAttachedInfo, setSubtitles } = _subtitles;
  const [_ws, setWs] = createSignal<WebSocket>();
  const [isWsconn, setIsWsconn] = createSignal<boolean>(false);

  // 每个page连接不一样的ws room
  const param = useParams<{ roomid: string }>();
  const url = ws_base_url + param.roomid;

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
      wsOn.onopen(ws, param.roomid);
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
      wsSend.heartBeat(ws);
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
          <Navi currentProject={param.roomid} userList={userList()}></Navi>
        </div>
        <div class="flex flex-auto pl-2">
          <div class="flex flex-col">
            <FloatingWindow
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
                <DisplayReview ws={_ws()}></DisplayReview>
              </div>
            </FloatingWindow>
            <FloatingWindow
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
              <SendPane roomid={param.roomid} ws={_ws()}></SendPane>
            </FloatingWindow>
          </div>
          <div class="flex-auto h-[calc(100vh-70px)]">
            <SendArea ws={_ws()} roomid={param.roomid}></SendArea>
          </div>
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

export default SendPage;
