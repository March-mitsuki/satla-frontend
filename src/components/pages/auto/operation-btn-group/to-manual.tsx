import { wsAutoSend } from "@/controllers";

// type
import type { Component } from "solid-js";
import type { AutoList } from "@/interfaces/autoplay";

const ToManulBtn: Component<{
  ws: WebSocket | undefined;
  elem: AutoList;
}> = (props) => {
  return (
    <button
      onClick={() => wsAutoSend.autoToManual(props.ws, props.elem.id)}
      class="flex items-center justify-center p-[2px] rounded-md bg-pink-400/70 hover:bg-pink-400/70 active:bg-pink-400/70"
    >
      <div class=" px-[5px]">M</div>
    </button>
  );
};

export default ToManulBtn;
