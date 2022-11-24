// dependencies lib
import { Component, createEffect, onCleanup } from "solid-js";
import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";

// local dependencies
import { wsSend } from "@/controllers";

// type
import { DisplayReview } from "@/components/pages";

const DisplayPage: Component = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL;

  const param = useParams<{ wsroom: string }>();
  const url = ws_base_url + param.wsroom;
  const room_id = Number(param.wsroom.split("_")[1]);
  if (isNaN(room_id)) {
    window.alert("错误的url: " + JSON.stringify(param.wsroom.split("_")));
    console.log("wrong params: ", param.wsroom.split("_"));
    return; // eslint-disable-line
  }

  const ws = new WebSocket(url);

  createEffect(() => {
    ws.onopen = () => {
      wsSend.heartBeat({ ws: ws, roomType: "nomal", roomId: room_id });

      console.log("ws connected");
    };
    ws.onclose = () => {
      console.log("ws close");
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
    });
  });

  return (
    <>
      <Title>Display Page</Title>
      <DisplayReview type="nomal" ws={ws} wsroom={param.wsroom} />
    </>
  );
};

export default DisplayPage;
