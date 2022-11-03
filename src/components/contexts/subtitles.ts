// dependencies lib
import { createSignal } from "solid-js";

// type
import { Subtitle, AttachedInfo } from "@/interfaces";

export const handleSubtitles = () => {
  const [subtitles, setSubtitles] = createSignal<Subtitle[]>();
  const [attachedInfo, setAttachedInfo] = createSignal<AttachedInfo[]>();
  return {
    subtitles,
    setSubtitles,
    attachedInfo,
    setAttachedInfo,
  };
};
