import { opeBtnStyle } from ".";
import { wsAutoSend } from "@/controllers";
import OpeStopBtn from "./stop";

// type
import type { Component } from "solid-js";
import type { AutoList } from "@/interfaces/autoplay";
const ManualBtns: Component<{
  ws: WebSocket | undefined;
  elem: AutoList;
}> = (props) => {
  return (
    <>
      <button
        onClick={() => wsAutoSend.autoPlayRewindTwice(props.ws, props.elem.id)}
        class="flex items-center justify-center p-[2px] rounded-md bg-pink-400/70 hover:bg-pink-400/70 active:bg-pink-400/70"
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
        class="flex items-center justify-center p-[2px] rounded-md bg-pink-400/70 hover:bg-pink-400/70 active:bg-pink-400/70"
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
      <OpeStopBtn ws={props.ws} elem={props.elem} />
      <button
        onClick={() => wsAutoSend.manualToAuto(props.ws, props.elem.id)}
        class={opeBtnStyle("sky")}
      >
        <div class=" px-[6px]">A</div>
      </button>
      <button
        onClick={() => wsAutoSend.autoPlayForward(props.ws, props.elem.id)}
        class="flex items-center justify-center p-[2px] rounded-md bg-pink-400/70 hover:bg-pink-400/70 active:bg-pink-400/70"
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
        class="flex items-center justify-center p-[2px] rounded-md bg-pink-400/70 hover:bg-pink-400/70 active:bg-pink-400/70"
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

export default ManualBtns;
