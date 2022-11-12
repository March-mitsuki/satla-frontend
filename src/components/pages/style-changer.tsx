// dependencies lib
import { createStore } from "solid-js/store";

// local dependencies
import { defaultOriginStyle, defaultSubtitleStyle, STORAGE_STYLE } from "../tools";
import { wsSend } from "@/controllers";

// type
import {
  s2cChangeBilingualBody,
  s2cChangeReversedBody,
  s2cChangeStyleBody,
  s2cEventMap,
  StyleData,
} from "@/interfaces/ws";
import { Component, createEffect, createSignal } from "solid-js";
import { RoomStyleData, StorageStyleData } from "@/interfaces/local-storage";

const inputStyle =
  "flex-1 rounded-lg bg-neutral-700 px-2 mx-1 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600";

const StyleChanger: Component<{
  ws: WebSocket | undefined;
  wsroom: string;
  wrapperFromClass: string;
}> = (props) => {
  const [reversed, setReversed] = createSignal<boolean>(false);
  const [bilingualSend, setBilingualSend] = createSignal(true); // true = 双语, false = 单语
  const [style, setStyle] = createStore<StyleData>({
    subtitle: defaultSubtitleStyle,
    origin: defaultOriginStyle,
  });

  // 如果有储存style那么设置style为储存style
  const storageStyleStr = localStorage.getItem(STORAGE_STYLE);
  let storageStyle: StorageStyleData | undefined;
  if (storageStyleStr) {
    storageStyle = JSON.parse(storageStyleStr) as StorageStyleData;
    const roomStyle: RoomStyleData | undefined = storageStyle[props.wsroom];
    if (roomStyle) {
      setStyle(roomStyle.style);
      setReversed(roomStyle.reversed);
      setBilingualSend(roomStyle.bilingualSend);
    }
  }

  const onStyleChangeSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.stopPropagation();
    e.preventDefault();
    wsSend.changeStyle({
      ws: props.ws,
      styleObj: style,
    });
  };

  const styleReversedToogleHandler = () => {
    wsSend.changeReversed(props.ws, !reversed());
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
    wsSend.changeBilingual(props.ws, !bilingualSend());
  };

  const delStorageRoomStyle = () => {
    const storageStyleStr = localStorage.getItem(STORAGE_STYLE);
    if (storageStyleStr) {
      if (storageStyleStr !== "") {
        const storageStyle = JSON.parse(storageStyleStr) as StorageStyleData;
        delete storageStyle[props.wsroom];
        localStorage.setItem(STORAGE_STYLE, JSON.stringify(storageStyle));
      }
    }
    location.reload();
  };

  createEffect(() => {
    if (!props.ws) {
      return;
    }
    props.ws.addEventListener("message", (evt) => {
      const data = JSON.parse(evt.data as string) as s2cEventMap;
      if (data.head.cmd === "sChangeBilingual") {
        const body = data.body as s2cChangeBilingualBody;
        setBilingualSend(body.bilingual);
        // 更新之后同时更新本地储存
        if (storageStyle) {
          if (storageStyle[props.wsroom]) {
            // 如果存在storage且存在对应房间
            storageStyle[props.wsroom].bilingualSend = body.bilingual;
          } else {
            // 如果存在storage但不存在对应房间
            storageStyle[props.wsroom] = {
              style: {
                subtitle: defaultSubtitleStyle,
                origin: defaultOriginStyle,
              },
              reversed: false,
              bilingualSend: body.bilingual,
            };
          }
        } else {
          // 如果根本不存在storage
          storageStyle = {
            [props.wsroom]: {
              style: {
                subtitle: defaultSubtitleStyle,
                origin: defaultOriginStyle,
              },
              reversed: false,
              bilingualSend: body.bilingual,
            },
          };
        }
        localStorage.setItem(STORAGE_STYLE, JSON.stringify(storageStyle));
      } else if (data.head.cmd === "sChangeStyle") {
        const body = data.body as s2cChangeStyleBody;
        setStyle({
          subtitle: body.subtitle,
          origin: body.origin,
        });
        // 更新之后同时更新本地储存
        if (storageStyle) {
          if (storageStyle[props.wsroom]) {
            // 如果存在storage且存在对应房间
            storageStyle[props.wsroom].style = {
              subtitle: body.subtitle,
              origin: body.origin,
            };
          } else {
            // 如果存在storage但不存在对应房间
            storageStyle[props.wsroom] = {
              style: {
                subtitle: body.subtitle,
                origin: body.origin,
              },
              reversed: false,
              bilingualSend: true,
            };
          }
        } else {
          // 如果根本不存在storage
          storageStyle = {
            [props.wsroom]: {
              style: {
                subtitle: body.subtitle,
                origin: body.origin,
              },
              reversed: false,
              bilingualSend: true,
            },
          };
        }
        localStorage.setItem(STORAGE_STYLE, JSON.stringify(storageStyle));
      } else if (data.head.cmd === "sChangeReversed") {
        const body = data.body as s2cChangeReversedBody;
        setReversed(body.reversed);
        // 更新之后同时更新本地储存
        if (storageStyle) {
          if (storageStyle[props.wsroom]) {
            // 如果存在storage且存在对应房间
            storageStyle[props.wsroom].reversed = body.reversed;
          } else {
            // 如果存在storage但不存在对应房间
            storageStyle[props.wsroom] = {
              style: {
                subtitle: defaultSubtitleStyle,
                origin: defaultOriginStyle,
              },
              reversed: body.reversed,
              bilingualSend: true,
            };
          }
        } else {
          // 如果根本不存在storage
          storageStyle = {
            [props.wsroom]: {
              style: {
                subtitle: defaultSubtitleStyle,
                origin: defaultOriginStyle,
              },
              reversed: body.reversed,
              bilingualSend: true,
            },
          };
        }
        localStorage.setItem(STORAGE_STYLE, JSON.stringify(storageStyle));
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
        <div class="flex items-center">
          <button
            onClick={delStorageRoomStyle}
            class="flex items-center bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70 rounded-full px-3 text-white text-sm"
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            房间缓存
          </button>
        </div>
        <div class="h-4 w-[2px] bg-gray-400 rounded-full"></div>
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={bilingualSend()}
              onChange={(e) => bilingualSendToggleHandler(e)}
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
          双语显示
        </label>
        <div class="h-4 w-[2px] bg-gray-400 rounded-full"></div>
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={reversed()}
              onChange={() => styleReversedToogleHandler()}
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
          调换位置
        </label>
        <div class="h-4 w-[2px] bg-gray-400 rounded-full"></div>
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
