import { wsAutoSend } from "@/controllers";

import type { Component } from "solid-js";

const OperationBlank: Component<{
  ws: WebSocket;
}> = (props) => {
  const handleClick = () => {
    wsAutoSend.autoPlaySendBlank(props.ws);
  };
  return (
    <div class="flex h-full">
      <button
        onClick={handleClick}
        class="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/70 hover:bg-orange-700/70 "
      >
        发送空行
      </button>
    </div>
  );
};

export default OperationBlank;
