// dependencies lib
import { createSignal } from "solid-js";

export const handlePageType = () => {
  const [pagetype, setPagetype] = createSignal(false); // false = 翻译, true = 校对
  const switchPagetype = () => setPagetype(!pagetype());

  const [isBilingual, setIsBilingual] = createSignal(true);
  const switchBilingual = () => setIsBilingual(!isBilingual());

  const [canOrder, setCanOrder] = createSignal(true);
  const switchCanOrder = () => setCanOrder(!canOrder());

  const [isBatchAdding, setIsBatchAdding] = createSignal(false); // 判断是否正在batadding

  return {
    pagetype,
    switchPagetype,
    isBilingual,
    switchBilingual,
    canOrder,
    switchCanOrder,
    isBatchAdding,
    setIsBatchAdding,
  };
};
