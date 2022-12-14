// dependencies lib
import { createEffect, For, Match, Switch } from "solid-js";

// local dependencies
import rootCtx from "../contexts";
import { wsOn, wsSend } from "@/controllers";

// type
import type { ParentComponent } from "solid-js";
import { Subtitle, AttachedInfo } from "@/interfaces";
import type {
  s2cEventMap,
  s2cDeleteSubtitleBody,
  s2cReorderSubBody,
  s2cAddTranslatedSubtitleBody,
  s2cSendSubtitleBody,
  s2cBatchAddSubsBody,
} from "@/interfaces/ws";

// for test
import dummySub from "@/assets/dummy-subtitles";

const inputStyle =
  "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600";

const SendArea: ParentComponent<{
  room_id: number;
  ws: WebSocket | undefined;
  wsroom: string;
}> = (props) => {
  const { subtitles, setSubtitles, attachedInfo, setAttachedInfo } = rootCtx.subtitlesCtx;
  const { currentUser } = rootCtx.currentUserCtx;
  const { setIsBatchAdding } = rootCtx.pageTypeCtx;

  // 各种初始化操作
  if (typeof subtitles() === "undefined") {
    setSubtitles(dummySub);
  }
  if (typeof attachedInfo() === "undefined") {
    const initialattachedInfo: AttachedInfo[] = [];
    for (let i = 0; i < (subtitles() as Subtitle[]).length; i++) {
      const elem = (subtitles() as Subtitle[])[i];
      const attachedInfo = new AttachedInfo(elem.id);
      initialattachedInfo.push(attachedInfo);
    }
    setAttachedInfo(initialattachedInfo);
  }

  const onSubmitHandler = (
    e: SubmitEvent & { currentTarget: HTMLFormElement },
    idx: number,
    subtitle: Subtitle,
  ) => {
    // 点击发送字幕
    e.stopPropagation();
    e.preventDefault();
    const formElem = e.currentTarget;

    subtitle.subtitle = formElem.subtitle.value as string;
    subtitle.origin = formElem.origin.value as string;
    subtitle.send_by = currentUser().user_name;
    wsSend.sendSubtitle({
      ws: props.ws,
      subtitle: subtitle,
    });
  };

  const formKeyDownHander = (
    e: KeyboardEvent & { currentTarget: HTMLFormElement },
    idx: number,
    subtitle: Subtitle,
  ) => {
    const formElem = e.currentTarget;

    if (e.shiftKey) {
      // shift + 小键盘上下 快捷键新建字幕
      if (e.key === "ArrowUp") {
        e.preventDefault();
        wsSend.addSubtitleUp({
          ws: props.ws,
          pre_id: subtitle.id,
          pre_idx: idx,
          room_id: subtitle.room_id,
        });
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        wsSend.addSubtitleDown({
          ws: props.ws,
          pre_id: subtitle.id,
          pre_idx: idx,
          room_id: subtitle.room_id,
        });
      }
      // shift + enter 移动到下一行
      if (e.key === "Enter") {
        e.preventDefault();
        if (document.activeElement?.getAttribute("name") === "subtitle") {
          document.getElementById(`${idx + 1}-sub`)?.focus();
        } else if (document.activeElement?.getAttribute("name") === "origin") {
          document.getElementById(`${idx + 1}-ori`)?.focus();
        }
      }
    }
    if (e.ctrlKey) {
      // ctrl + enter 移动到上一行
      if (e.key === "Enter") {
        e.preventDefault();
        if (document.activeElement?.getAttribute("name") === "subtitle") {
          document.getElementById(`${idx - 1}-sub`)?.focus();
        } else if (document.activeElement?.getAttribute("name") === "origin") {
          document.getElementById(`${idx - 1}-ori`)?.focus();
        }
      }
    }
    // 按回车更改字幕
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();

      subtitle.subtitle = formElem.subtitle.value as string;
      subtitle.origin = formElem.origin.value as string;
      subtitle.checked_by = currentUser().user_name;
      wsSend.changeSubtitle({ ws: props.ws, subtitle: subtitle });
    }
  };

  const addUpClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault();
    wsSend.addSubtitleUp({
      ws: props.ws,
      pre_id: subtitle.id,
      pre_idx: idx,
      room_id: subtitle.room_id,
    });
  };
  const addDownClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault();
    wsSend.addSubtitleDown({
      ws: props.ws,
      pre_id: subtitle.id,
      pre_idx: idx,
      room_id: subtitle.room_id,
    });
  };

  const delClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault();
    wsSend.deleteSubtitle(props.ws, subtitle);
  };

  const onInputHandler = (idx: number) => {
    const dc_attachedInfo = attachedInfo()?.map((x) => x);
    if (!dc_attachedInfo) {
      return;
    }
    dc_attachedInfo[idx].changeStatus = 1;
    setAttachedInfo(dc_attachedInfo);
  };

  const sendBlankHandler = (e: MouseEvent) => {
    e.preventDefault();
    console.log("发送空行");
    // 目前的发送空行是借用direct send的逻辑
    // 所以服务端是先通过subtitle.room_id查找room之后创建新字幕

    const newSub = new Subtitle({
      id: 0,
      room_id: props.room_id,
      translated_by: currentUser().user_name,
      checked_by: currentUser().user_name,
      send_by: currentUser().user_name,
      origin: "",
      subtitle: "",
    });
    wsSend.sendSubtitleDirect({
      ws: props.ws,
      subtitle: newSub,
    });
  };

  createEffect(() => {
    // 更新逻辑: 监听用户操作 -> ws.send -> ws.onmessage -> 页面更新(启动更新函数)
    if (!props.ws) {
      return;
    }
    props.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data as string) as s2cEventMap;
      switch (data.head.cmd) {
        case "sChangeUser":
          wsOn.addUser(data);
          break;
        case "sGetRoomSubtitles":
          wsOn.getRoomSubtitles(data); // eslint-disable-line @typescript-eslint/no-floating-promises
          break;
        case "sAddSubtitleUp":
          wsOn.addSubtitleUp(data);
          break;
        case "sAddSubtitleDown":
          wsOn.addSubtitleDown(data);
          break;
        case "sChangeSubtitle":
          wsOn.changeSubtitle(data);
          break;
        case "sEditStart":
          wsOn.editStart(data);
          break;
        case "sEditEnd":
          wsOn.editEnd(data);
          break;
        case "sAddTransSub":
          wsOn.addTranslatedSub(data);
          {
            const body = data.body as s2cAddTranslatedSubtitleBody;
            if (body.new_subtitle.translated_by === currentUser().user_name) {
              // 如果是自己加的行, 那么加了之后清空send-form (位于同一page不同components)
              // 与send-pane是发送模式还是输入模式无关, 只要是自己发送的就该清空
              const translateForm = document.getElementById("send-form");
              (translateForm as HTMLFormElement).subtitle.value = "";
              (translateForm as HTMLFormElement).origin.value = "";
            }
            break;
          }
        case "sDeleteSubtitle": {
          const body = data.body as s2cDeleteSubtitleBody;
          if (!body.status) {
            console.log("delete failed, please check the server side");
            return;
          }
          wsOn.deleteSubtitle(body.subtitle_id);
          break;
        }
        case "sReorderSubFront": {
          const body = data.body as s2cReorderSubBody;
          if (body.operation_user === currentUser().user_name) {
            if (!body.status) {
              // 如果是自己操作, 那么成功了则什么都不做, 失败了则通知失败
              window.alert("拖动失败, 请刷新重试");
            }
          } else {
            if (body.status) {
              // 若是别人操作, 则成功了还行, 失败了什么都不做
              wsOn.reorderSubFrontOther({
                drag_id: body.drag_id,
                drop_id: body.drop_id,
              });
            }
          }
          break;
        }
        case "sReorderSubBack": {
          const body = data.body as s2cReorderSubBody;
          if (body.operation_user === currentUser().user_name) {
            if (!body.status) {
              window.alert("拖动失败, 请刷新重试");
            }
          } else {
            if (body.status) {
              wsOn.reorderSubBackOther({
                drag_id: body.drag_id,
                drop_id: body.drop_id,
              });
            }
          }
          break;
        }
        case "sSendSubtitle": {
          const body = data.body as s2cSendSubtitleBody;
          if (!body.status) {
            console.log("send subtitle failed, please check the server side");
            return;
          }
          wsOn.deleteSubtitle(body.subtitle.id);
          break;
        }
        case "sSendSubtitleDirect": {
          const body = data.body as s2cSendSubtitleBody;
          if (!body.status) {
            console.log("send subtitle failed, please check the server side");
            return;
          }
          console.log("send sub direct on: ", data);

          if (body.subtitle.send_by === currentUser().user_name) {
            // 直接发送成功, 并且send_by是自己时清空send-form
            const translateForm = document.getElementById("send-form");
            (translateForm as HTMLFormElement).subtitle.value = "";
            (translateForm as HTMLFormElement).origin.value = "";
          }
          break;
        }
        case "sBatchAddSubs": {
          const body = data.body as s2cBatchAddSubsBody;
          if (!body.status) {
            window.alert("批量添加出错,请检查文件是否合规后刷新重试");
          }
          setIsBatchAdding(false);
          wsSend.getRoomSubtitles(props.ws, props.room_id);
          break;
        }
        case "heartBeat":
          console.log("--heartbeat--");
          break;
      }
    };
  });

  return (
    <div class="h-full pb-4 overflow-auto flex flex-col">
      <For each={subtitles()}>
        {(elem, idx) => {
          console.log("creat For!");
          return (
            <>
              {subtitles()?.length !== 0 && attachedInfo()?.length !== 0 && (
                <div
                  style={{
                    "z-index": (attachedInfo() as AttachedInfo[])[idx()].zIndex,
                    position: `${(attachedInfo() as AttachedInfo[])[idx()].position}`,
                    top: `${(attachedInfo() as AttachedInfo[])[idx()].y}px`,
                  }}
                  classList={{
                    "mt-2": (attachedInfo() as AttachedInfo[])[idx()].isDrop === false,
                    "mt-2 border-t-2 border-sky-500":
                      (attachedInfo() as AttachedInfo[])[idx()].isDrop === true,
                  }}
                  hidden={(attachedInfo() as AttachedInfo[])[idx()].hidden}
                >
                  <form
                    id={`${elem.id}-form`}
                    onKeyDown={(e) => formKeyDownHander(e, idx(), elem)}
                    onSubmit={(e) => onSubmitHandler(e, idx(), elem)}
                    onInput={() => onInputHandler(idx())}
                    classList={{
                      "flex px-2 gap-2 items-center":
                        (attachedInfo() as AttachedInfo[])[idx()].changeStatus === 0,
                      "flex px-2 gap-2 items-center border-2 border-sky-500 rounded-lg":
                        (attachedInfo() as AttachedInfo[])[idx()].changeStatus === 1,
                      "flex px-2 gap-2 items-center border-2 border-red-500 rounded-lg":
                        (attachedInfo() as AttachedInfo[])[idx()].changeStatus === 2,
                    }}
                  >
                    <Switch
                      fallback={
                        <div class="flex gap-3 w-[180px] items-center px-1 rounded-md bg-orange-500/70 select-none">
                          <div class="flex-1">{elem.input_time}</div>
                          <div class="flex-1 truncate text-center">{elem.translated_by}</div>
                        </div>
                      }
                    >
                      <Match when={(attachedInfo() as AttachedInfo[])[idx()].isEditing}>
                        <div class="flex gap-3 w-[180px] items-center px-1 rounded-md bg-red-500/70 select-none">
                          <div class="flex gap-1 justify-between items-center flex-1 truncate">
                            <div class="flex-1">
                              <div class="shrink-0 animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                            </div>
                            <div class="flex-1">
                              {(attachedInfo() as AttachedInfo[])[idx()].editingUser}
                            </div>
                          </div>
                        </div>
                      </Match>
                      <Match when={elem.checked_by !== null && elem.checked_by !== ""}>
                        <div class="flex gap-3 w-[180px] items-center px-1 rounded-md bg-green-500/70 select-none">
                          <div class="flex-1">{elem.input_time}</div>
                          <div class="flex-1 truncate text-center">{elem.checked_by}</div>
                        </div>
                      </Match>
                    </Switch>
                    <button
                      onClick={(e) => delClickHandler(e, idx(), elem)}
                      class="rounded-md p-1 bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70"
                    >
                      {/* del btn */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => addUpClickHandler(e, idx(), elem)}
                      class="rounded-md p-1 bg-amber-500/70 hover:bg-amber-700/70 active:bg-amber-500/70"
                    >
                      {/* add up btn */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => addDownClickHandler(e, idx(), elem)}
                      class="rounded-md p-1 bg-amber-500/70 hover:bg-amber-700/70 active:bg-amber-500/70"
                    >
                      {/* add down btn */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => sendBlankHandler(e)}
                      class="rounded-md p-1 bg-sky-500/70 hover:bg-sky-700/70 active:bg-sky-500/70"
                    >
                      {/* submit btn */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                      </svg>
                    </button>
                    <button
                      type="submit"
                      class="rounded-md p-1 bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70"
                    >
                      {/* submit btn */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                      </svg>
                    </button>
                    <input
                      id={`${idx()}-sub`}
                      type="text"
                      name="subtitle"
                      autocomplete="off"
                      placeholder="请输入翻译"
                      onFocus={() => wsSend.editStart(props.ws, elem.id)}
                      onBlur={() => wsSend.editEnd(props.ws, elem.id)}
                      value={elem.subtitle}
                      class={inputStyle}
                    />
                    <input
                      id={`${idx()}-ori`}
                      type="text"
                      name="origin"
                      autocomplete="off"
                      placeholder="请输入原文"
                      onFocus={() => wsSend.editStart(props.ws, elem.id)}
                      onBlur={() => wsSend.editEnd(props.ws, elem.id)}
                      value={elem.origin}
                      class={inputStyle}
                    />
                  </form>
                </div>
              )}
            </>
          );
        }}
      </For>
    </div>
  );
};

export default SendArea;
