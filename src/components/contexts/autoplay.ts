import { createSignal } from "solid-js";

import { AutoList, PlayingStat } from "@/interfaces/autoplay";

export const handleAutoplay = () => {
  const [autoList, setAutoList] = createSignal<AutoList[]>();
  const [playingStat, setPlayingStat] = createSignal<PlayingStat>({
    stat: 0, // 0 -> 停止, 1 -> 播放中, 2 -> 暂停
    playingID: -1,
  });
  return { autoList, setAutoList, playingStat, setPlayingStat };
};
