import { wsAutoSend } from "@/controllers";

import type { Component } from "solid-js";

const OperationRecover: Component<{
  ws: WebSocket | undefined;
  room_id: number;
}> = (props) => {
  const handleClick = () => {
    wsAutoSend.recoverAutoPlayStat(props.ws, props.room_id);
  };
  return (
    <div class="flex h-full">
      <button
        onClick={handleClick}
        class="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/70 hover:bg-red-700/70 "
      >
        重置房间
      </button>
    </div>
  );
};

export default OperationRecover;
