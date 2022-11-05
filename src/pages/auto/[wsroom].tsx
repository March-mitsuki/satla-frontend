// dependencies lib
import { useParams } from "@solidjs/router";
import { createEffect, onCleanup } from "solid-js";
import { Title } from "@solidjs/meta";

// local dependencies
import { wsSend } from "@/controllers";
import { AutoNavi, AutoPreview, AssUploader } from "@/components/pages/auto";

const AutoPlay = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL;

  // 每个page连接不一样的ws room
  const param = useParams<{ wsroom: string }>();
  const url = ws_base_url + param.wsroom;
  const room_id = Number(param.wsroom.split("_")[1]);
  if (isNaN(room_id)) {
    window.alert("错误的url: " + JSON.stringify(param.wsroom.split("_")));
    console.log("wrong params: ", param.wsroom.split("_"));
    return;
  }
  const ws = new WebSocket(url);

  createEffect(() => {
    ws.onopen = () => {
      console.log("ws connect");
    };
    ws.onclose = () => {
      console.log("ws close");
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
    });
  });

  return (
    <>
      <Title>Auto Player</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="mb-2 text-xl py-3 px-5">
          <AutoNavi></AutoNavi>
        </div>
        <div class="sticky border-t-2 shadow-lg flex items-center">
          <AutoPreview></AutoPreview>
        </div>
        <div class="py-3 px-5 flex gap-5 items-center justify-center">
          <AssUploader room_id={room_id}></AssUploader>
          <div class="h-8 w-[2px] bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default AutoPlay;
