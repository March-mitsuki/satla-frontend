import { opeBtnStyle } from ".";
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
      class={opeBtnStyle("fuchsia")}
    >
      <div class=" px-[5px]">M</div>
    </button>
  );
};

export default ToManulBtn;
