// dependencies lib
import { Component, createEffect, createSignal, Match, onCleanup, Switch } from 'solid-js';
import { createStore } from "solid-js/store"
import { Title } from '@solidjs/meta';
import { Subtitle } from '@/interfaces';
import { useParams } from '@solidjs/router';

// type
import type { s2cEventMap, s2cSendSubtitleBody } from '@/interfaces/ws';

const DisplayPage: Component = () => {
  const ws_base_url = import.meta.env.VITE_WS_BASE_URL

  const [ subtitle, setSubtitle ] = createSignal<Subtitle>()
  const [ style, setStyle ] = createStore<{
    subtitle: string
    origin: string
    reversed: boolean
  }>({
    subtitle: "text-2xl text-center",
    origin: "text-lg text-center",
    reversed: false,
  })

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

    ws.onmessage = (evt) => {
      const data: s2cEventMap = JSON.parse(evt.data)      
      if (
        data.head.cmd === "sSendSubtitle" ||
        data.head.cmd === "sSendSubtitleDirect"
      ) {
        console.log("on msg:", data);
        const sendSubBody: s2cSendSubtitleBody = data.body
        if (!sendSubBody.status) {
          return
        }
        setSubtitle(sendSubBody.subtitle)
      }
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
      <Switch>
        <Match when={style.reversed}>
          {/* reversed === true */}
          <div class={style.origin}>
            {subtitle()?.origin}
          </div>
          <div class={style.subtitle}>
            {subtitle()?.subtitle}
          </div>
        </Match>
        <Match when={!style.reversed}>
          {/* reversed === false */}
          <div class={style.subtitle}>
            {subtitle()?.subtitle}
          </div>
          <div class={style.origin}>
            {subtitle()?.origin}
          </div>
        </Match>
      </Switch>
    </>
  );
};

export default DisplayPage;
