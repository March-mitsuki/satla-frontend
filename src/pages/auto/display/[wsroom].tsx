// dependencies lib
import { Component, createEffect, onCleanup } from "solid-js";
import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";

// local dependencies
import { wsAutoSend, wsSend } from "@/controllers";

// type
import { DisplayReview } from "@/components/pages";

const AutoDisplayPage: Component = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL;

  const param = useParams<{ wsroom: string }>();
  const url = ws_base_url + param.wsroom;
  const ws = new WebSocket(url);

  createEffect(() => {
    ws.onopen = () => {
      console.log("ws connected");
      wsAutoSend.getAutoPlayStat(ws);
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
      <Title>Auto Display</Title>
      <DisplayReview type="auto" ws={ws} wsroom={param.wsroom} />
    </>
  );
};

export default AutoDisplayPage;
