// dependices lib
import { createEffect, createSignal, Match, Switch } from "solid-js"

// type
import type {
  s2cChangeBilingualBody,
  s2cChangeReversedBody,
  s2cChangeStyleBody,
  s2cEventMap,
  s2cSendSubtitleBody,
  StyleData
} from "@/interfaces/ws"
import type { Component } from "solid-js"
import { Subtitle } from "@/interfaces"

const DisplayReview: Component<{
  ws: WebSocket | undefined
}> = (props) => {
  const [ subtitle, setSubtitle ] = createSignal<Subtitle>()
  const [ style, setStyle ] = createSignal<StyleData>({
    subtitle: "font-size:24px; line-height:32px; font-weight:700; text-align:center;",
    origin: "font-size:18px; line-height:24px; font-weight:700; text-align:center;",
  })
  const [ bilingual, setBilingual ] = createSignal<boolean>(true)
  const [ reversed, setReversed ] = createSignal<boolean>(false)

  createEffect(() => {
    if (!props.ws) {
      return
    }
    props.ws.addEventListener("message", (evt) => {
      const data: s2cEventMap = JSON.parse(evt.data)      
      if (
        data.head.cmd === "sSendSubtitle" ||
        data.head.cmd === "sSendSubtitleDirect"
      ) {
        const body: s2cSendSubtitleBody = data.body
        if (!body.status) {
          return
        }
        setSubtitle(body.subtitle)
      } else if (data.head.cmd === "sChangeStyle") {
        console.log("change style msg:", data);
        const body: s2cChangeStyleBody = data.body
        setStyle(body)
      } else if (data.head.cmd === "sChangeBilingual") {
        const body: s2cChangeBilingualBody = data.body
        setBilingual(body.bilingual)
      } else if (data.head.cmd === "sChangeReversed") {
        const body: s2cChangeReversedBody = data.body
        setReversed(body.reversed)
      }
    })
  })
  return (
    <>
      <Switch>
        <Match when={reversed() && bilingual()}>
          {/* reversed === true */}
          <div style={style().origin}>
            {subtitle()?.origin}
          </div>
          <div style={style().subtitle}>
            {subtitle()?.subtitle}
          </div>
        </Match>
        <Match when={reversed() && !bilingual()}>
          <div style={style().origin}>
            {subtitle()?.origin}
          </div>
        </Match>

        <Match when={!reversed() && bilingual()}>
          {/* reversed === false */}
          <div style={style().subtitle}>
            {subtitle()?.subtitle}
          </div>
          <div style={style().origin}>
            {subtitle()?.origin}
          </div>
        </Match>
        <Match when={!reversed() && !bilingual()}>
          <div style={style().subtitle}>
            {subtitle()?.subtitle}
          </div>
        </Match>
      </Switch>
    </>
  )
}

export default DisplayReview