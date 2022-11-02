// dependencies lib
import { createSignal, For, Match, Switch } from "solid-js";
import { DateTime } from "luxon";

// local dependencies
import _pagetype from "../contexts/page-type";
import { Subtitle } from "@/interfaces";
import _currentInfo from "@/components/contexts/current-info-ctx";
import { wsSend } from "@/controllers";
import { STORAGE_MEMO } from "../tools";

// type
import type { Component } from "solid-js";
import { StorageMemoData } from "@/interfaces/local-storage";

const inputStyle =
  "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600";

const TranslatePane: Component<{
  ws: WebSocket | undefined;
  roomid: string;
}> = (props) => {
  const {
    // pagetype: false = 翻译, true = 校对, default = false
    pagetype,
    switchPagetype,
    // bilingual: 是否显示双语
    isBilingual,
    switchBilingual,
    // canOrder: 是否可以拖动排序
    canOrder,
    switchCanOrder,
  } = _pagetype;
  const [checkMemo, setCheckMemo] = createSignal<string[]>([""]);
  const storageMemoStr = localStorage.getItem(STORAGE_MEMO);
  let storageMemo: StorageMemoData | undefined;
  if (storageMemoStr) {
    storageMemo = JSON.parse(storageMemoStr) as StorageMemoData;
    const roomMemo: string[] | null = storageMemo[props.roomid];
    setCheckMemo(roomMemo);
  }

  const addTranslateSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.stopPropagation();
    e.preventDefault();
    const formElem = e.currentTarget;
    const fmtdt = DateTime.now()
      .setZone("Asia/Tokyo")
      .minus({
        seconds: 30,
      })
      .toFormat("HH:mm:ss");
    const newSub = new Subtitle({
      // project_id和新id都从服务器拿, 服务器根据roomid进行插入
      id: 0,
      input_time: fmtdt,
      project_id: 0,
      translated_by: _currentInfo.currentUser().user_name,
      origin: formElem.origin.value as string,
      subtitle: formElem.subtitle.value as string,
    });
    wsSend.addTranslatedSubtitle({
      ws: props.ws,
      subtitle: newSub,
      project_name: props.roomid,
    });
  };

  /*
    以下校对工具栏
  */

  const updateStorageMemo = () => {
    // 无论是删是加要做的事情都一样, 只要更改了就要改localStorage
    if (storageMemo) {
      // 无论是否存在房间写的东西都一样(更改已存在和增加新要素都是同一个写法)
      storageMemo[props.roomid] = checkMemo();
    } else {
      // 若不存在则需要新建一整个storage构造体
      storageMemo = {
        [props.roomid]: checkMemo(),
      };
    }
    localStorage.setItem(STORAGE_MEMO, JSON.stringify(storageMemo));
  };

  const addCheckMemo = () => {
    checkMemo().push("");
    updateStorageMemo();
  };

  const changeCheckMemo = (idx: number, value: string) => {
    checkMemo()[idx] = value;
    setCheckMemo(checkMemo().map((x) => x));
    updateStorageMemo();
    console.log("change memo: ", checkMemo());
  };

  const checkMemoKeyDownHandler = (
    e: KeyboardEvent & { currentTarget: HTMLFormElement },
    idx: number,
  ) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      const formElem = e.currentTarget;
      changeCheckMemo(idx, formElem.checkmemo.value as string);
    }
  };
  const checkMemoSubmitHandler = (e: Event & { currentTarget: HTMLFormElement }, idx: number) => {
    e.preventDefault();
    const formElem = e.currentTarget;
    changeCheckMemo(idx, formElem.checkmemo.value as string);
  };

  let checkMeoWrapperRef: HTMLDivElement | undefined;

  return (
    <div class="mt-1 flex flex-col gap-1 h-full">
      <div class="flex gap-2 px-1 justify-center">
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={isBilingual()}
              onChange={() => switchBilingual()}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div
              class="
                absolute w-4 h-4 bg-white/70 rounded-full shadow
                peer-checked:translate-x-4 peer-checked:bg-blue-400
                transition drop-shadow
              "
            ></div>
          </div>
          显示双语
        </label>
        <div class="border-l-2"></div>
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={canOrder()}
              onChange={() => switchCanOrder()}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div
              class="
                absolute w-4 h-4 bg-white/70 rounded-full shadow
                peer-checked:translate-x-4 peer-checked:bg-blue-400
                transition drop-shadow
              "
            ></div>
          </div>
          拖动排序
        </label>
        <div class="border-l-2"></div>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          翻译
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={pagetype()}
              onChange={() => switchPagetype()}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div class="absolute -left-1 peer-checked:translate-x-6 transition">
              <Switch>
                {/* 切换toggle的左右箭头 */}
                <Match when={pagetype() === false}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-orange-500/75 rounded-full drop-shadow"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Match>
                <Match when={pagetype() === true}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-green-500/75 rounded-full drop-shadow"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Match>
              </Switch>
            </div>
          </div>
          校对
        </label>
      </div>
      <Switch>
        <Match when={pagetype() === false}>
          <form
            id="translate-form"
            onSubmit={(e) => addTranslateSubmitHandler(e)}
            class="flex gap-1 px-1"
          >
            <input
              type="text"
              name="subtitle"
              autocomplete="off"
              placeholder="请输入翻译"
              class={inputStyle}
            />
            <input
              type="text"
              name="origin"
              autocomplete="off"
              placeholder="请输入原文"
              classList={{
                [inputStyle]: isBilingual() === true,
                hidden: isBilingual() === false,
              }}
            />
            <button
              type="submit"
              class="bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-full px-3 text-white"
            >
              输入
            </button>
          </form>
        </Match>
        <Match when={pagetype() === true}>
          <div
            ref={checkMeoWrapperRef}
            class="flex flex-col px-1 pb-2 gap-1 overflow-auto h-[calc(100%-35px)]"
          >
            {checkMemo().length === 0 && (
              <div class="flex justify-end items-center">
                <button
                  onClick={() => {
                    checkMemo().push("");
                    // 通过切换两次page type来刷新列表
                    switchPagetype();
                    switchPagetype();
                    updateStorageMemo();
                  }}
                  class="flex items-center justify-center text-sm rounded-md p-1 bg-amber-500/70 hover:bg-amber-700/70 active:bg-amber-500/70"
                >
                  {/* add new btn */}
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
                  新增一行
                </button>
              </div>
            )}
            <For each={checkMemo()}>
              {(elem, idx) => (
                <form
                  onKeyDown={(e) => checkMemoKeyDownHandler(e, idx())}
                  onSubmit={(e) => checkMemoSubmitHandler(e, idx())}
                  class="flex gap-1"
                >
                  <input
                    type="text"
                    name="checkmemo"
                    autocomplete="off"
                    placeholder="memo"
                    onBlur={(e) => changeCheckMemo(idx(), e.currentTarget.value)}
                    class={inputStyle}
                    value={elem}
                  />
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
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => addCheckMemo()}
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
                    onClick={(e) => {
                      e.preventDefault();
                      const dc_checkMemo = checkMemo().map((x) => x);
                      dc_checkMemo.splice(idx(), 1);
                      setCheckMemo(dc_checkMemo);
                      updateStorageMemo();
                    }}
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
                </form>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default TranslatePane;
