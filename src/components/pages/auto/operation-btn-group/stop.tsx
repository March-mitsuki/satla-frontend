import { opeBtnStyle } from ".";
import { wsAutoSend } from "@/controllers";

// type
import type { Component } from "solid-js";
import type { AutoList } from "@/interfaces/autoplay";

const OpeStopBtn: Component<{
  ws: WebSocket | undefined;
  elem: AutoList;
}> = (props) => {
  const handlePlayEnd = (
    e: MouseEvent & { currentTarget: HTMLButtonElement },
    currentList: AutoList,
  ) => {
    e.preventDefault();
    wsAutoSend.autoPlayEnd(props.ws, currentList.id);
    // setPlayingStat({ stat: 0, playingID: -1 });
  };
  return (
    <button onClick={(e) => handlePlayEnd(e, props.elem)} class={opeBtnStyle("red")}>
      {/* 停止播放 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
        />
      </svg>
    </button>
  );
};

export default OpeStopBtn;
