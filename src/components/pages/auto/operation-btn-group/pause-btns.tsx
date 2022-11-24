import { opeBtnStyle } from ".";
import { wsAutoSend } from "@/controllers";
import OpeStopBtn from "./stop";

// type
import type { Component } from "solid-js";
import type { AutoList } from "@/interfaces/autoplay";
import ToManulBtn from "./to-manual";

const PauseBtns: Component<{
  ws: WebSocket | undefined;
  elem: AutoList;
}> = (props) => {
  return (
    <>
      <button
        onClick={() => wsAutoSend.autoPlayRestart(props.ws, props.elem.id)}
        class={opeBtnStyle("green")}
      >
        {/* 重新开始 */}
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
            d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
          />
        </svg>
      </button>
      <OpeStopBtn ws={props.ws} elem={props.elem} />
      <ToManulBtn ws={props.ws} elem={props.elem} />
    </>
  );
};

export default PauseBtns;
