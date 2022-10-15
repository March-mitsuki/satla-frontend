// dependencies lib
import { Component, createEffect, createSignal, Match, onCleanup, Switch } from 'solid-js';
import { Title } from '@solidjs/meta';
import { useParams } from '@solidjs/router';

// type
import { DisplayReview } from '@/components/pages';

const DisplayPage: Component = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL

  const param = useParams<{ roomid: string }>()
  const url = ws_base_url + param.roomid
  const ws = new WebSocket(url)

  createEffect(() => {
    ws.onopen = () => {
      console.log("ws connected");
    }
    ws.onclose = () => {
      console.log("ws close");
    }
    ws.onerror = (evt) => {
      console.log("ws err", evt);
    }

    onCleanup(() => {
      if (ws.readyState === ws.OPEN) {
        ws.close()
      }
    })
  })

  return (
    <>
      <Title>Display Page</Title>
      <DisplayReview ws={ws}></DisplayReview>
    </>
  );
};

export default DisplayPage;
