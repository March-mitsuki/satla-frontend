import { createRoot, createSignal } from "solid-js";

import { Subtitle, FloatingElem } from "@/interfaces";

const handlerSubtitles = () => {
  const [subtitles, setSubtitles] = createSignal<Subtitle[]>()
  const [floatingElem, setFloatingElem] = createSignal<FloatingElem[]>()
  return {
    subtitles, setSubtitles,
    floatingElem, setFloatingElem,
  }
}

export default createRoot(handlerSubtitles)
