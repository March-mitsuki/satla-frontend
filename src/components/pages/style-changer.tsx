// dependencies lib
import { createStore } from "solid-js/store";

// local dependencies
import { wsSend } from "@/controllers";
import { defaultChangeStyleBodyData } from "@/interfaces/ws";

// type
import type { s2cChangeStyleBody, s2cEventMap, ChangeStyleBody } from "@/interfaces/ws";
import { Component, createEffect } from "solid-js";

const inputStyle =
  "flex-1 rounded-lg bg-neutral-700 px-2 mx-1 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600";

const StyleChanger: Component<{
  ws: WebSocket | undefined;
  wsroom: string;
  wrapperFromClass: string;
}> = (props) => {
  const [style, setStyle] = createStore<ChangeStyleBody>(defaultChangeStyleBodyData);

  const onStyleChangeSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.stopPropagation();
    e.preventDefault();
    wsSend.changeStyle({
      ws: props.ws,
      styleObj: style,
    });
  };

  const styleReversedToggleHandler = () => {
    setStyle("reversed", !style.reversed);
    wsSend.changeStyle({ ws: props.ws, styleObj: style });
  };

  const subtitleStyleInputHandler = (
    e: InputEvent & {
      currentTarget: HTMLTextAreaElement;
    },
  ) => {
    e.preventDefault();
    setStyle("subtitle", e.currentTarget.value);
  };

  const originStyleInputHandler = (
    e: InputEvent & {
      currentTarget: HTMLTextAreaElement;
    },
  ) => {
    e.preventDefault();
    setStyle("origin", e.currentTarget.value);
  };

  const bilingualSendToggleHandler = (e: Event) => {
    e.preventDefault();
    setStyle("bilingual", !style.bilingual);
    wsSend.changeStyle({ ws: props.ws, styleObj: style });
  };

  createEffect(() => {
    if (!props.ws) {
      return;
    }
    props.ws.addEventListener("message", (evt) => {
      const data = JSON.parse(evt.data as string) as s2cEventMap;
      if (data.head.cmd === "sChangeStyle") {
        const body = data.body as s2cChangeStyleBody;
        setStyle(body);
      }
    });
  });

  return (
    <form
      id="send-style-form"
      onSubmit={(e) => onStyleChangeSubmitHandler(e)}
      class={props.wrapperFromClass}
    >
      <label class="flex items-center justify-center gap-2">
        <div class="text-sm">翻译:</div>
        <textarea
          name="subtitleStyle"
          placeholder="翻译样式"
          onInput={(e) => subtitleStyleInputHandler(e)}
          class={inputStyle}
        >
          {style.subtitle}
        </textarea>
      </label>
      <label class="flex items-center justify-center gap-2">
        <div class="text-sm">原文:</div>
        <textarea
          name="originStyle"
          placeholder="原文样式"
          onInput={(e) => originStyleInputHandler(e)}
          class={inputStyle}
        >
          {style.origin}
        </textarea>
      </label>
      <div class="flex gap-2 items-center justify-center">
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={style.bilingual}
              onChange={(e) => bilingualSendToggleHandler(e)}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full" />
            <div
              class="
                  absolute w-4 h-4 bg-white/70 rounded-full shadow
                  peer-checked:translate-x-4 peer-checked:bg-blue-400
                  transition drop-shadow
                "
            />
          </div>
          双语显示
        </label>
        <div class="h-4 w-[2px] bg-gray-400 rounded-full" />
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={style.reversed}
              onChange={() => styleReversedToggleHandler()}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full" />
            <div
              class="
                  absolute w-4 h-4 bg-white/70 rounded-full shadow
                  peer-checked:translate-x-4 peer-checked:bg-blue-400
                  transition drop-shadow
                "
            />
          </div>
          调换位置
        </label>
        <div class="h-4 w-[2px] bg-gray-400 rounded-full" />
        <button
          type="submit"
          class="bg-orange-500/70 hover:bg-orange-700/70 active:bg-orange-500/70 rounded-full px-3 text-white text-sm"
        >
          提交
        </button>
      </div>
    </form>
  );
};

export default StyleChanger;
