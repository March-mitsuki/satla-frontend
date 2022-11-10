import { createSignal } from "solid-js";

import { AutoList, PlayingStat } from "@/interfaces/autoplay";

export const handleAutoplay = () => {
  const [autoList, setAutoList] = createSignal<AutoList[]>();
  const [playingStat, setPlayingStat] = createSignal<PlayingStat>({
    isPlaying: false,
    playingID: -1,
  });
  return { autoList, setAutoList, playingStat, setPlayingStat };
};
