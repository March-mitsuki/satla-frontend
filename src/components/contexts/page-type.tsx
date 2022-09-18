import { createRoot, createSignal } from "solid-js";

const handlerPageType = () => {
  const [pagetype, setPagetype] = createSignal(false) // false = 翻译, true = 校对
  const switchPagetype = () => setPagetype(!pagetype())
  return { pagetype, switchPagetype }
}

export default createRoot(handlerPageType)
