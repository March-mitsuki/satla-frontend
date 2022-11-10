// dependencies lib
import { createEffect, For, Match, Switch } from "solid-js";

// local dependencies
import rootCtx from "@/components/contexts";
import { wsAutoOn, wsAutoSend } from "@/controllers";

// type
import { s2cEventMap } from "@/interfaces/ws";
import { s2cAddAutoSubBody, s2cAutoChangeSub, s2cGetRoomAutoListsBody } from "@/interfaces/ws-auto";
import { Component } from "solid-js";
import { AutoList } from "@/interfaces/autoplay";

const opeBtnStyle = (color: string) => {
  return `flex items-center justify-center p-[2px] rounded-md bg-${color}-500/70 hover:bg-${color}-700/70 active:bg-${color}-500/70`;
};

const Operation: Component<{
  ws: WebSocket;
}> = (props) => {
  const { autoList, playingStat, setPlayingStat } = rootCtx.autoplayCtx;

  const handlePlayStart = (
    e: MouseEvent & { currentTarget: HTMLButtonElement },
    currentList: AutoList,
  ) => {
    e.preventDefault();
    wsAutoSend.autoPlayStart(props.ws, currentList.id);
    setPlayingStat({ isPlaying: true, playingID: currentList.id });
  };

  const handlerPlayEnd = (
    e: MouseEvent & { currentTarget: HTMLButtonElement },
    currentList: AutoList,
  ) => {
    e.preventDefault();
    wsAutoSend.autoPlayEnd(props.ws, currentList.id);
    setPlayingStat({ isPlaying: false, playingID: -1 });
  };

  createEffect(() => {
    props.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data as string) as s2cEventMap;
      switch (data.head.cmd) {
        case "sGetRoomAutoLists": {
          const body = data.body as s2cGetRoomAutoListsBody;
          wsAutoOn.getRoomAutoLists(body);
          break;
        }
        case "sAddAutoSub": {
          const body = data.body as s2cAddAutoSubBody;
          wsAutoOn.addAutoSub(body);
          break;
        }
        case "autoChangeSub": {
          const body = data.body as s2cAutoChangeSub;
          console.log("[change]", body.auto_sub.subtitle + " | " + body.auto_sub.origin);
          break;
        }
        case "heartBeat":
          console.log("---heartBeat---");
          break;
        default:
          console.log("---unhandler cmd---");
          console.log(data);
          console.log("---unhandler cmd---");
          break;
      }
    };
  });

  return (
    <div class="flex flex-col gap-2 p-2 w-full">
      <div class="grid grid-cols-7 pb-2">
        <div class="grid grid-cols-2">
          <div class="text-center truncate font-bold text-xl">删除</div>
          <div class="text-center truncate font-bold text-xl">List ID</div>
        </div>
        <div class="text-center truncate font-bold text-xl col-span-2">首句原文</div>
        <div class="text-center truncate font-bold text-xl col-span-2">首句翻译</div>
        <div class="text-center truncate font-bold text-xl">备注</div>
        <div class="text-center truncate font-bold text-xl">操作</div>
      </div>
      <For each={autoList()}>
        {(elem) => {
          console.log("auto opreration render once");
          return (
            <div class="grid grid-cols-7 border-2 border-neutral-500 rounded-full py-1">
              <div class="grid grid-cols-2">
                <div class="flex justify-center items-center">
                  <button class={opeBtnStyle("red")}>
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
                <div class="text-center truncate">{elem.id}</div>
              </div>
              <div class="text-center truncate col-span-2">{elem.first_origin}</div>
              <div class="text-center truncate col-span-2">{elem.first_subtitle}</div>
              <div class="text-center truncate">{elem.memo}</div>
              <div class="flex items-center justify-center gap-5">
                <Switch
                  fallback={
                    <div class="flex items-center justify-center p-[2px] rounded-md bg-neutral-500 cursor-not-allowed ">
                      {/* 禁止操作 */}
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
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  }
                >
                  <Match
                    when={playingStat().isPlaying === true && playingStat().playingID === elem.id}
                  >
                    <button class={opeBtnStyle("sky")}>
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
                    <button class={opeBtnStyle("sky")}>
                      {/* 后退 */}
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
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
                    <button class={opeBtnStyle("red")} onClick={(e) => handlerPlayEnd(e, elem)}>
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
                          d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                        />
                      </svg>
                    </button>
                    <button class={opeBtnStyle("sky")}>
                      {/* 前进 */}
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
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                    <button class={opeBtnStyle("sky")}>
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
                  </Match>
                  <Match when={playingStat().isPlaying === false}>
                    <button class={opeBtnStyle("sky")} onClick={(e) => handlePlayStart(e, elem)}>
                      {/* 开始 */}
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
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                        />
                      </svg>
                    </button>
                  </Match>
                </Switch>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default Operation;
