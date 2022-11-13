// dependices lib
import { createEffect, createSignal, Match, Switch } from "solid-js";
import { defaultOriginStyle, defaultSubtitleStyle } from "../tools";

// type
import type {
  s2cChangeBilingualBody,
  s2cChangeReversedBody,
  s2cChangeStyleBody,
  s2cEventMap,
  s2cSendSubtitleBody,
  StyleData,
} from "@/interfaces/ws";
import type { Component } from "solid-js";
import { Subtitle } from "@/interfaces";
import { s2cAutoChangeSub, s2cGetAutoPlayStatBody } from "@/interfaces/ws-auto";
import { AutoSub } from "@/interfaces/autoplay";

const DisplayReview: Component<{
  ws: WebSocket | undefined;
  type: "auto" | "nomal";
}> = (props) => {
  const [subtitle, setSubtitle] = createSignal<Subtitle>();
  const [autoSub, setAutoSub] = createSignal<AutoSub>();

  const [style, setStyle] = createSignal<StyleData>({
    subtitle: defaultSubtitleStyle,
    origin: defaultOriginStyle,
  });
  const [bilingual, setBilingual] = createSignal<boolean>(true);
  const [reversed, setReversed] = createSignal<boolean>(false);

  createEffect(() => {
    if (!props.ws) {
      return;
    }
    props.ws.addEventListener("message", (evt) => {
      const data = JSON.parse(evt.data as string) as s2cEventMap;
      if (data.head.cmd === "sSendSubtitle" || data.head.cmd === "sSendSubtitleDirect") {
        const body = data.body as s2cSendSubtitleBody;
        if (!body.status) {
          return;
        }
        setSubtitle(body.subtitle);
      } else if (data.head.cmd === "sChangeStyle") {
        console.log("change style msg:", data);
        const body = data.body as s2cChangeStyleBody;
        setStyle(body);
      } else if (data.head.cmd === "sChangeBilingual") {
        const body = data.body as s2cChangeBilingualBody;
        setBilingual(body.bilingual);
      } else if (data.head.cmd === "sChangeReversed") {
        const body = data.body as s2cChangeReversedBody;
        setReversed(body.reversed);
      }

      if (props.type === "auto") {
        if (data.head.cmd === "sGetAutoPlayStat") {
          const body = data.body as s2cGetAutoPlayStatBody;
          if (body.state === 1 || body.state === 2) {
            setAutoSub(body.now_sub);
          }
        } else if (data.head.cmd === "autoChangeSub") {
          const body = data.body as s2cAutoChangeSub;
          setAutoSub(body.auto_sub);
        }
      }
    });
  });
  return (
    <>
      <Switch>
        <Match when={reversed() && bilingual()}>
          {/* reversed === true */}
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
        <Match when={reversed() && !bilingual()}>
          <div style={style().origin}>
            <Switch>
              <Match when={props.type === "nomal"}>{subtitle()?.origin}</Match>
              <Match when={props.type === "auto"}>{autoSub()?.origin}</Match>
            </Switch>
          </div>
        </Match>

        <Match when={!reversed() && bilingual()}>
          {/* reversed === false */}
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
        <Match when={!reversed() && !bilingual()}>
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
