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

const DisplayReview: Component<{
  ws: WebSocket | undefined;
}> = (props) => {
  const [subtitle, setSubtitle] = createSignal<Subtitle>();
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
    });
  });
  return (
    <>
      <Switch>
        <Match when={reversed() && bilingual()}>
          {/* reversed === true */}
          <div style={style().origin}>{subtitle()?.origin}</div>
          <div style={style().subtitle}>{subtitle()?.subtitle}</div>
        </Match>
        <Match when={reversed() && !bilingual()}>
          <div style={style().origin}>{subtitle()?.origin}</div>
        </Match>

        <Match when={!reversed() && bilingual()}>
          {/* reversed === false */}
          <div style={style().subtitle}>{subtitle()?.subtitle}</div>
          <div style={style().origin}>{subtitle()?.origin}</div>
        </Match>
        <Match when={!reversed() && !bilingual()}>
          <div style={style().subtitle}>{subtitle()?.subtitle}</div>
        </Match>
      </Switch>
    </>
  );
};

export default DisplayReview;
