// dependencies lib
import { createRoot, createSignal } from "solid-js";

// type
import { Subtitle, AttachedInfo } from "@/interfaces";

const handlerSubtitles = () => {
  const [subtitles, setSubtitles] = createSignal<Subtitle[]>()
  const [attachedInfo, setAttachedInfo] = createSignal<AttachedInfo[]>()
  return {
    subtitles, setSubtitles,
    attachedInfo, setAttachedInfo,
  }
}

export default createRoot(handlerSubtitles)
