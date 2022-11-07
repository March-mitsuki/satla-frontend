import { createSignal } from "solid-js";

import { AutoList } from "@/interfaces/autoplay";

export const handleAutoplay = () => {
  const [autoList, setAutoList] = createSignal<AutoList[]>();
  return { autoList, setAutoList };
};
