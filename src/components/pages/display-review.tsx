// dependices lib
import { createEffect, createSignal, Match, onCleanup, Switch } from "solid-js";

// local dependencies
import { defaultChangeStyleBodyData } from "@/interfaces/ws";

// type
import type {
  s2cChangeStyleBody,
  s2cEventMap,
  s2cSendSubtitleBody,
  ChangeStyleBody,
} from "@/interfaces/ws";
import type { Component } from "solid-js";
import { Subtitle } from "@/interfaces";
import { s2cAutoChangeSub, s2cGetAutoPlayStatBody } from "@/interfaces/ws-auto";
import { AutoSub } from "@/interfaces/autoplay";
import { wsAutoSend, wsSend } from "@/controllers";
import { logger } from "../tools";

const DisplayReview: Component<{
  ws: WebSocket | undefined;
  wsroom: string;
  type: "auto" | "nomal";
}> = (props) => {
  const [subtitle, setSubtitle] = createSignal<Subtitle>();
  const [autoSub, setAutoSub] = createSignal<AutoSub>();

  const [style, setStyle] = createSignal<ChangeStyleBody>(defaultChangeStyleBodyData);

  const openEventController: AbortController = new AbortController();
  const messageEventController: AbortController = new AbortController();

  createEffect(() => {
    logger.nomal("display-review", "effect run once");
    if (!props.ws) {
      return;
    }
    props.ws.addEventListener(
      "open",
      () => {
        wsSend.getNowRoomStyle({ ws: props.ws, wsroom: props.wsroom });
        if (props.type === "auto") {
          wsAutoSend.getAutoPlayStat(props.ws);
        } else {
          wsSend.getNowRoomSub({ ws: props.ws, wsroom: props.wsroom });
        }
      },
      { signal: openEventController.signal },
    );
    props.ws.addEventListener(
      "message",
      (evt) => {
        const data = JSON.parse(evt.data as string) as s2cEventMap;
        if (data.head.cmd === "sSendSubtitle" || data.head.cmd === "sSendSubtitleDirect") {
          const body = data.body as s2cSendSubtitleBody;
          if (!body.status) {
            return;
          }
          setSubtitle(body.subtitle);
          logger.info("display-review", "subtitle change once");
        } else if (data.head.cmd === "sChangeStyle") {
          console.log("change style msg:", data);
          const body = data.body as s2cChangeStyleBody;
          setStyle(body);
        }

        if (props.type === "auto") {
          if (data.head.cmd === "sGetAutoPlayStat") {
            const body = data.body as s2cGetAutoPlayStatBody;
            if (body.state === 1 || body.state === 2) {
              setAutoSub(body.now_sub);
            }
          } else if (data.head.cmd === "autoChangeSub") {
            logger.info("display-review", "[type auto]", "sub change once");
            const body = data.body as s2cAutoChangeSub;
            setAutoSub(body.auto_sub);
          }
        }
      },
      { signal: messageEventController.signal },
    );

    if (props.ws.readyState === props.ws.OPEN) {
      logger.info("display-review", "manual send");
      if (props.type === "auto") {
        wsAutoSend.getAutoPlayStat(props.ws);
      } else {
        wsSend.getNowRoomSub({ ws: props.ws, wsroom: props.wsroom });
      }
    }
  });

  onCleanup(() => {
    setSubtitle(undefined);
    setAutoSub(undefined);
    setStyle(defaultChangeStyleBodyData);
    openEventController.abort();
    messageEventController.abort();
  });

  return (
    <>
      <Switch>
        {/* reversed === true */}
        <Match when={style().reversed && style().bilingual}>
          <div style={style().origin}>
            <Switch>
              <Match when={props.type === "nomal"}>{subtitle()?.origin}</Match>
              <Match when={props.type === "auto"}>{autoSub()?.origin}</Match>
            </Switch>
          </div>
          <div style={style().subtitle}>
            <Switch>
              <Match when={props.type === "nomal"}>{subtitle()?.subtitle}</Match>
              <Match when={props.type === "auto"}>{autoSub()?.subtitle}</Match>
            </Switch>
          </div>
        </Match>
        <Match when={style().reversed && !style().bilingual}>
          <div style={style().origin}>
            <Switch>
              <Match when={props.type === "nomal"}>{subtitle()?.origin}</Match>
              <Match when={props.type === "auto"}>{autoSub()?.origin}</Match>
            </Switch>
          </div>
        </Match>

        {/* reversed === false */}
        <Match when={!style().reversed && style().bilingual}>
          <div style={style().subtitle}>
            <Switch>
              <Match when={props.type === "nomal"}>{subtitle()?.subtitle}</Match>
              <Match when={props.type === "auto"}>{autoSub()?.subtitle}</Match>
            </Switch>
          </div>
          <div style={style().origin}>
            <Switch>
              <Match when={props.type === "nomal"}>{subtitle()?.origin}</Match>
              <Match when={props.type === "auto"}>{autoSub()?.origin}</Match>
            </Switch>
          </div>
        </Match>
        <Match when={!style().reversed && !style().bilingual}>
          <div style={style().subtitle}>
            <Switch>
              <Match when={props.type === "nomal"}>{subtitle()?.subtitle}</Match>
              <Match when={props.type === "auto"}>{autoSub()?.subtitle}</Match>
            </Switch>
          </div>
        </Match>
      </Switch>
    </>
  );
};

export default DisplayReview;
