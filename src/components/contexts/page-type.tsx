import { createRoot, createSignal } from "solid-js";

const handlerPageType = () => {
  const [pagetype, setPagetype] = createSignal(false) // false = 翻译, true = 校对
  const switchPagetype = () => setPagetype(!pagetype())

  const [isBilingual, setIsBilingual] = createSignal(true)
  const switchBilingual = () => setIsBilingual(!isBilingual())

  return {
    pagetype, switchPagetype,
    isBilingual, switchBilingual,
  }
}

export default createRoot(handlerPageType)
