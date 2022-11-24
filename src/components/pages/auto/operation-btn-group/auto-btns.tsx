import { opeBtnStyle } from ".";
import { wsAutoSend } from "@/controllers";
import OpeStopBtn from "./stop";

// type
import type { Component } from "solid-js";
import type { AutoList } from "@/interfaces/autoplay";
import ToManulBtn from "./to-manual";
const AutoBtns: Component<{
  ws: WebSocket | undefined;
  elem: AutoList;
}> = (props) => {
  return (
    <>
      <button
        onClick={() => wsAutoSend.autoPlayRewindTwice(props.ws, props.elem.id)}
        class={opeBtnStyle("sky")}
      >
        {/* 后退退 */}
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
            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={() => wsAutoSend.autoPlayRewind(props.ws, props.elem.id)}
        class={opeBtnStyle("sky")}
      >
        {/* 后退 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={() => wsAutoSend.autoPlayPause(props.ws, props.elem.id)}
        class={opeBtnStyle("orange")}
      >
        {/* 暂停 */}
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
            d="M15.75 5.25v13.5m-7.5-13.5v13.5"
          />
        </svg>
      </button>
      <OpeStopBtn ws={props.ws} elem={props.elem} />
      <ToManulBtn ws={props.ws} elem={props.elem} />
      <button
        onClick={() => wsAutoSend.autoPlayForward(props.ws, props.elem.id)}
        class={opeBtnStyle("sky")}
      >
        {/* 前进 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <button
        onClick={() => wsAutoSend.autoPlayForwardTwice(props.ws, props.elem.id)}
        class={opeBtnStyle("sky")}
      >
        {/* 前前进 */}
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
            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </>
  );
};

export default AutoBtns;
