// dependencies lib
import { createEffect, createSignal, For, Match, Switch } from "solid-js";

// local dependencies
import rootCtx from "@/components/contexts";
import { wsAutoOn, wsAutoSend, wsOn } from "@/controllers";
import { AutoBtns, ManualBtns, opeBtnStyle, PauseBtns } from "./operation-btn-group";

// type
import { s2cEventMap } from "@/interfaces/ws";
import {
  s2cAddAutoSubBody,
  s2cGetRoomAutoListsBody,
  s2cDeleteAutoSubBody,
  s2cGetAutoPlayStatBody,
  s2cAutoPlayErrBody,
  s2cRecoverPlayStatBody,
  s2cChangeAutoMemoBody,
  s2cAutoPlayOpeResBody,
} from "@/interfaces/ws-auto";
import { Component } from "solid-js";
import { AutoList } from "@/interfaces/autoplay";

const Operation: Component<{
  ws: WebSocket | undefined;
}> = (props) => {
  const { autoList, playingStat, setPlayingStat } = rootCtx.autoplayCtx;
  const [editMemo, setEditMemo] = createSignal<{
    list_id: number;
    isEdit: boolean;
  }>({
    list_id: -1,
    isEdit: false,
  });

  const handlePlayStart = (
    e: MouseEvent & { currentTarget: HTMLButtonElement },
    currentList: AutoList,
  ) => {
    e.preventDefault();
    wsAutoSend.autoPlayStart(props.ws, currentList.id);
    // setPlayingStat({ stat: 1, playingID: currentList.id });
  };

  const handleMemoChange = (
    e: MouseEvent & {
      currentTarget: HTMLDivElement;
    },
    currentList: AutoList,
  ) => {
    e.preventDefault();
    setEditMemo({ list_id: currentList.id, isEdit: true });
    document.getElementById(`memoChanger${currentList.id}`)?.focus();
  };
  const sendMemoChange = (
    e: KeyboardEvent & { currentTarget: HTMLInputElement },
    currentList: AutoList,
  ) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      wsAutoSend.changeAutoMemo(props.ws, currentList.id, e.currentTarget.value);
      setEditMemo({ list_id: -1, isEdit: false });
    }
  };

  createEffect(() => {
    if (!props.ws) {
      console.log("ws is undefined");
      return;
    }
    props.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data as string) as s2cEventMap;
      switch (data.head.cmd) {
        case "sChangeUser":
          wsOn.addUser(data);
          break;
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
        case "sPlayStart": {
          const body = data.body as s2cAutoPlayOpeResBody;
          setPlayingStat({ stat: 1, playingID: body.list_id });
          wsAutoOn.changeStartListBg(body.list_id);
          break;
        }
        case "sPlayPause": {
          const body = data.body as s2cAutoPlayOpeResBody;
          setPlayingStat({ stat: 2, playingID: body.list_id });
          wsAutoOn.changeStartListBg(body.list_id);
          break;
        }
        case "sPlayRestart": {
          const body = data.body as s2cAutoPlayOpeResBody;
          setPlayingStat({ stat: 1, playingID: body.list_id });
          wsAutoOn.changeStartListBg(body.list_id);
          break;
        }
        case "sAutoToManual": {
          const body = data.body as s2cAutoPlayOpeResBody;
          setPlayingStat({ stat: 3, playingID: body.list_id });
          wsAutoOn.changeStartListBg(body.list_id);
          break;
        }
        case "sManualToAuto": {
          const body = data.body as s2cAutoPlayOpeResBody;
          setPlayingStat({ stat: 1, playingID: body.list_id });
          wsAutoOn.changeStartListBg(body.list_id);
          break;
        }
        case "sPlayEnd":
          setPlayingStat({ stat: 0, playingID: -1 });
          break;
        case "sDeleteAutoSub": {
          console.log("[info] sDeleteAutoSub recive");
          const body = data.body as s2cDeleteAutoSubBody;
          wsAutoOn.deleteAutoSub(body);
          break;
        }
        case "sGetAutoPlayStat": {
          const body = data.body as s2cGetAutoPlayStatBody;
          // 0 -> stopped, 1 -> playing
          // 2 -> paused, 3 -> manually
          // logger.info("operation", "get auto play stat", body);
          if (body.state === 0) {
            setPlayingStat({ stat: 0, playingID: -1 });
          } else if (body.state === 1) {
            setPlayingStat({ stat: 1, playingID: body.list_id });
          } else if (body.state === 2) {
            setPlayingStat({ stat: 2, playingID: body.list_id });
          } else if (body.state === 3) {
            setPlayingStat({ stat: 3, playingID: body.list_id });
          } else {
            window.alert("读取房间数据出错, 请记下bug触发顺序后联系管理员联系管理员");
          }
          break;
        }
        case "autoPlayErr": {
          const body = data.body as s2cAutoPlayErrBody;
          const msg = "[auto play err] " + JSON.stringify(body.msg);
          window.alert(msg);
          break;
        }
        case "sRecoverAutoPlayStat": {
          const body = data.body as s2cRecoverPlayStatBody;
          if (body.status) {
            window.alert("当前房间状态已被重置, 请按确认并刷新页面");
            location.reload();
          } else {
            window.alert("初始化房间失败, 请联系网站管理员");
          }
          break;
        }
        case "sChangeAutoMemo": {
          const body = data.body as s2cChangeAutoMemoBody;
          wsAutoOn.changeAutoMemo(body);
          break;
        }
        case "heartBeat":
          console.log("---heartBeat---");
          break;
      }
    };
  });

  return (
    <div class="flex flex-col gap-2 p-2 w-full">
      <div class="grid grid-cols-11 pb-2">
        <div class="grid grid-cols-2">
          <div class="text-center truncate font-bold text-xl">删除</div>
          <div class="text-center truncate font-bold text-xl">List ID</div>
        </div>
        <div class="text-center truncate font-bold text-xl col-span-3">首句原文</div>
        <div class="text-center truncate font-bold text-xl col-span-3">首句翻译</div>
        <div class="text-center truncate font-bold text-xl">备注</div>
        <div class="text-center truncate font-bold text-xl col-span-3">
          <Switch fallback={"操作"}>
            <Match when={playingStat().stat === 1}>{"操作(自动)"}</Match>
            <Match when={playingStat().stat === 3}>{"操作(手动)"}</Match>
          </Switch>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-2 w-full overflow-scroll h-[calc(100vh-360px)] ">
        <For each={autoList()}>
          {(elem) => {
            console.log("auto opreration render once");
            return (
              <div
                classList={{
                  "grid grid-cols-11 border-2 border-neutral-500 rounded-full py-1":
                    elem.is_sent === false,
                  "grid grid-cols-11 border-2 border-neutral-500 rounded-full py-1 bg-neutral-500":
                    elem.is_sent === true,
                }}
              >
                <div class="grid grid-cols-2">
                  <div class="flex justify-center items-center">
                    <button
                      onClick={() => wsAutoSend.deleteAutoList(props.ws, elem.id)}
                      class={opeBtnStyle("red")}
                    >
                      {/* 删除 */}
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
                <div class="text-center truncate col-span-3">{elem.first_origin}</div>
                <div class="text-center truncate col-span-3">{elem.first_subtitle}</div>
                <Switch
                  fallback={
                    <div
                      id={`autoMemoDiv${elem.id}`}
                      class="text-center truncate select-none"
                      onDblClick={(e) => handleMemoChange(e, elem)} // eslint-disable-line
                    >
                      {elem.memo}
                    </div>
                  }
                >
                  <Match when={editMemo().isEdit === true && editMemo().list_id === elem.id}>
                    <input
                      type="text"
                      id={`memoChanger${elem.id}`}
                      onBlur={() => setEditMemo({ list_id: -1, isEdit: false })}
                      value={elem.memo}
                      autocomplete="off"
                      placeholder="请输入"
                      onKeyDown={(e) => sendMemoChange(e, elem)}
                      class="rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600 text-center"
                    />
                  </Match>
                </Switch>
                <div class="col-span-3 flex items-center justify-center gap-5">
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
                    <Match when={playingStat().stat === 1 && playingStat().playingID === elem.id}>
                      <AutoBtns ws={props.ws} elem={elem} />
                    </Match>
                    <Match when={playingStat().stat === 2 && playingStat().playingID === elem.id}>
                      <PauseBtns ws={props.ws} elem={elem} />
                    </Match>
                    <Match when={playingStat().stat === 3 && playingStat().playingID === elem.id}>
                      <ManualBtns ws={props.ws} elem={elem} />
                    </Match>
                    <Match when={playingStat().stat === 0}>
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
    </div>
  );
};

export default Operation;
