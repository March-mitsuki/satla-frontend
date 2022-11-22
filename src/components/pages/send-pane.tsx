// dependencies lib
import { createSignal, Match, Switch } from "solid-js";

// local dependencies
import rootCtx from "../contexts";
import { Subtitle } from "@/interfaces";
import { wsSend } from "@/controllers";

// type
import type { Component } from "solid-js";
import StyleChanger from "./style-changer";

const inputStyle =
  "flex-1 rounded-lg bg-neutral-700 px-2 mx-1 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600";

const SendPane: Component<{
  room_id: number;
  wsroom: string;
  ws: WebSocket | undefined;
}> = (props) => {
  const { currentUser } = rootCtx.currentUserCtx;

  const [inputType, setInputType] = createSignal(false); // true = 输入, false = 发送

  const onSendSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.stopPropagation();
    e.preventDefault();

    const formElem = e.currentTarget;
    if (inputType()) {
      // 输入
      const newSub = new Subtitle({
        id: 0,
        room_id: props.room_id,
        translated_by: currentUser().user_name,
        checked_by: currentUser().user_name,
        origin: formElem.origin.value as string,
        subtitle: formElem.subtitle.value as string,
      });
      wsSend.addTranslatedSubtitle({
        ws: props.ws,
        subtitle: newSub,
      });
    } else {
      // 直接发送
      const newSub = new Subtitle({
        id: 0,
        room_id: props.room_id,
        translated_by: currentUser().user_name,
        checked_by: currentUser().user_name,
        send_by: currentUser().user_name,
        origin: formElem.origin.value as string,
        subtitle: formElem.subtitle.value as string,
      });
      // 直接发送不需要更新任何发送和操作页面的元素, 只需要更新display中的字幕就行
      // 即check-area不需要监听这个cmd的onmessage
      // send-area只需要监听之后清空send-form就行了
      wsSend.sendSubtitleDirect({
        ws: props.ws,
        subtitle: newSub,
      });
    }
  };

  const inputTypeToggleHandler = (e: Event) => {
    e.preventDefault();
    setInputType(!inputType());
  };

  const openDisplayPage = () => {
    window.open(`/display/${props.wsroom}`, "_blank");
  };

  return (
    <div class="mt-1 flex flex-col gap-1 h-full">
      <div class="flex gap-2 px-1 justify-center">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          发送
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={inputType()}
              onChange={(e) => inputTypeToggleHandler(e)}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full" />
            <div class="absolute -left-1 peer-checked:translate-x-6 transition">
              <Switch>
                {/* 切换toggle的左右箭头 */}
                <Match when={!inputType()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-red-500/75 rounded-full drop-shadow"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Match>
                <Match when={inputType()}>
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
          输入
        </label>
        <div class="border-l-2 border-neutral-400" />
        <div class="flex items-center">
          <button
            onClick={openDisplayPage}
            class="flex justify-center items-center bg-cyan-600/75 rounded-md px-2 hover:bg-cyan-700/75 text-sm"
          >
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
                d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z"
              />
            </svg>
            <div class="pl-[2px]">打开视窗</div>
          </button>
        </div>
      </div>
      <form id="send-form" onSubmit={(e) => onSendSubmitHandler(e)} class="flex gap-1 px-1">
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
          class={inputStyle}
        />
        <button
          type="submit"
          classList={{
            "bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-full px-3 text-white":
              inputType() === true,
            "bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70 rounded-full px-3 text-white":
              inputType() === false,
          }}
        >
          {inputType() ? "输入" : "发送"}
        </button>
      </form>
      <div class="flex flex-col items-center justify-center pt-4 pb-2">
        <div class="w-[calc(100%-70%)] h-1 bg-neutral-400 rounded-lg" />
        <div class="pt-1 text-sm">*构建样式时请遵循css的规则</div>
      </div>
      <StyleChanger
        ws={props.ws}
        wsroom={props.wsroom}
        wrapperFromClass="flex flex-col gap-2 px-5 pb-1 overflow-auto h-[calc(100%-120px)]"
       />
    </div>
  );
};

export default SendPane;
