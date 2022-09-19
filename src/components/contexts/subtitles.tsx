import { createRoot, createSignal } from "solid-js";
import { createStore } from "solid-js/store"
import dummySub from "@/assets/dummy-subtitles"

// const handlerSubtitles = () => {
//   const [subtitles, setSubtitles] = createStore(dummySub)
//   return { subtitles, setSubtitles }
// }

const handlerSubtitles = () => {
  const [subtitles, setSubtitles] = createSignal(dummySub)
  return { subtitles, setSubtitles }
}

export default createRoot(handlerSubtitles)
