// dependencies lib
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { Title } from '@solidjs/meta';
import { Subtitle } from '@/interfaces';
import { useParams } from '@solidjs/router';

// type
import type { s2cEventMap, s2cSendSubtitleBody } from '@/interfaces/ws';

const DisplayPage: Component = () => {
  const ws_base_url = import.meta.env.WS_BASE_URL

  const [ subtitle, setSubtitle ] = createSignal<Subtitle>()

  createEffect(() => {
    const param = useParams<{ roomid: string }>()
    const url = ws_base_url + param.roomid
    const ws = new WebSocket(url)
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
      <div>
        <div>
          {subtitle()?.subtitle}
        </div>
        <div>
          {subtitle()?.origin}
        </div>
      </div>
    </>
  );
};

export default DisplayPage;
