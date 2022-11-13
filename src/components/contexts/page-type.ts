// dependencies lib
import { createSignal } from "solid-js";

export const handlePageType = () => {
  const [pagetype, setPagetype] = createSignal(false); // false = 翻译, true = 校对
  const switchPagetype = () => setPagetype(!pagetype());

  const [isBilingual, setIsBilingual] = createSignal(true);
  const switchBilingual = () => setIsBilingual(!isBilingual());

  const [canOrder, setCanOrder] = createSignal(true);
  const switchCanOrder = () => setCanOrder(!canOrder());

  return {
    pagetype,
    switchPagetype,
    isBilingual,
    switchBilingual,
    canOrder,
    switchCanOrder,
  };
};
