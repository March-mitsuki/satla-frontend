// dependencies lib
import { createEffect, createSignal, Match, Switch } from "solid-js"
import { createStore } from "solid-js/store"

// local dependencies
import _currentInfo from "../contexts/current-info-ctx"
import { Subtitle } from "@/interfaces"
import { wsSend } from "@/controllers"

// type
import type { Component } from "solid-js"
import { s2cChangeBilingualBody, s2cChangeReversedBody, s2cChangeStyleBody, s2cEventMap, StyleData } from "@/interfaces/ws"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const SendPane: Component<{
  roomid: string
  ws: WebSocket | undefined
}> = (props) => {
  const [inputType, setInputType] = createSignal(false) // true = 输入, false = 发送
  const [bilingualSend, setBilingualSend] = createSignal(true) // true = 双语, false = 单语
  const [style, setStyle] = createStore<StyleData>({
    subtitle: "font-size:24px; line-height:32px; font-weight:700; text-align:center;",
    origin: "font-size:18px; line-height:24px; font-weight:700; text-align:center;",
  })
  const [reversed, setReversed] = createSignal<boolean>(false)

  const onSendSubmitHandler = (
    e: SubmitEvent & { currentTarget: HTMLFormElement}
  ) => {
    e.stopPropagation()
    e.preventDefault()

    const formElem = e.currentTarget
    if (inputType()) {
      // 输入
      console.log("输入");
      const newSub = new Subtitle({
        // project_id和id都为0, 服务器会根据roomid寻找对应project进行插入
        id: 0,
        project_id: 0,
        translated_by: _currentInfo.currentUser().user_name,
        checked_by: _currentInfo.currentUser().user_name,
        origin: formElem.origin.value,
        subtitle: formElem.subtitle.value,
      })
      wsSend.addTranslatedSubtitle({
        ws: props.ws,
        subtitle: newSub,
        project_name: props.roomid
      })
    } else {
      // 发送
      console.log("直接发送");
      const newSub = new Subtitle({
        id: 0,
        project_id: 0,
        translated_by: _currentInfo.currentUser().user_name,
        checked_by: _currentInfo.currentUser().user_name,
        send_by: _currentInfo.currentUser().user_name,
        origin: formElem.origin.value,
        subtitle: formElem.subtitle.value,
      })
      // 直接发送不需要更新任何发送和操作页面的元素, 只需要更新display中的字幕就行
      // 即check-area不需要监听这个cmd的onmessage
      // send-area只需要监听之后清空send-form就行了
      wsSend.sendSubtitleDirect({
        ws: props.ws,
        subtitle: newSub,
        roomid: props.roomid
      })
    }
  }

  const inputTypeToggleHandler = (e: Event) => {
    e.preventDefault()
    setInputType(!inputType())
  }
  const bilingualSendToggleHandler = (e: Event) => {
    e.preventDefault()
    wsSend.changeBilingual(props.ws, !bilingualSend())
  }

  const openDisplayPage = () => {
    window.open(`/display/${props.roomid}`, "_blank")
  }

  const onStyleChangeSubmitHandler = (
    e: SubmitEvent & { currentTarget: HTMLFormElement}
  ) => {
    e.stopPropagation()
    e.preventDefault()
    wsSend.changeStyle({
      ws: props.ws,
      styleObj: style,
    })
  }
  const styleReversedToogleHandler = (e: Event) => {
    wsSend.changeReversed(props.ws, !reversed())
  }
  const subtitleStyleInputHandler = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
    }
  ) => {
    e.preventDefault()
    setStyle("subtitle", e.currentTarget.value)
  }
  const originStyleInputHandler = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
    }
  ) => {
    e.preventDefault()
    setStyle("origin", e.currentTarget.value)
  }

  createEffect(() => {
    if (!props.ws) {
      return
    }
    props.ws.addEventListener("message", (evt) => {
      const data: s2cEventMap = JSON.parse(evt.data) 
      if (data.head.cmd === "sChangeBilingual") {
        const body: s2cChangeBilingualBody = data.body
        setBilingualSend(body.bilingual)
      } else if (data.head.cmd === "sChangeStyle") {
        const body: s2cChangeStyleBody = data.body
        setStyle({
          subtitle: body.subtitle,
          origin: body.origin,
        })
      } else if (data.head.cmd === "sChangeReversed") {
        const body: s2cChangeReversedBody = data.body
        setReversed(body.reversed)
      }
    })
  })

  return (
    <div class="mt-1 flex flex-col gap-1">
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
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div 
              class="absolute -left-1 peer-checked:translate-x-6 transition"
            >
              <Switch>
                {/* 切换toggle的左右箭头 */}
                <Match when={!inputType()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-red-500/75 rounded-full drop-shadow"
                  >
                    <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
                  </svg>
                </Match>
                <Match when={inputType()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-green-500/75 rounded-full drop-shadow"
                  >
                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                  </svg>
                </Match>
              </Switch>
            </div>
          </div>
          输入
        </label>
        <div class="border-l-2 border-neutral-400"></div>
        <div class="flex items-center">
          <button
            onClick={openDisplayPage}
            class="flex bg-cyan-600/75 rounded-md px-2 hover:bg-cyan-700/75 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 18" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z" />
            </svg>
            <div class="pl-[2px]">
              打开视窗
            </div>
          </button>
        </div>
      </div>
      <form
        id="send-form"
        onSubmit={(e) => onSendSubmitHandler(e)}
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
          class={inputStyle}
        />
        <button
          type="submit"
          classList={{
            "bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-full px-3 text-white": inputType() === true,
            "bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70 rounded-full px-3 text-white": inputType() === false,
          }}
        >
          {inputType() ? "输入" : "发送"}
        </button>
      </form>
      <div class="flex flex-col items-center justify-center pt-4 pb-2">
        <div class="w-[calc(100%-70%)] h-1 bg-neutral-400 rounded-lg"></div>
        <div class="pt-1 text-sm">*构建样式时请遵循Tailwindcss的规则</div>
      </div>
      <form
        id="send-style-form"
        onSubmit={(e) => onStyleChangeSubmitHandler(e)}
        class="flex flex-col gap-1 px-1 pb-1"
      >
        <label class="flex gap-2">
          <div class="text-sm">
            翻译:
          </div>
          <input
            type="text"
            name="subtitleStyle"
            placeholder="翻译样式"
            onInput={(e) => subtitleStyleInputHandler(e)}
            value={style.subtitle}
            class={inputStyle}
          />
        </label>
        <label class="flex gap-2">
          <div class="text-sm">
            原文:
          </div>
          <input
            type="text"
            name="originStyle"
            placeholder="原文样式"
            onInput={(e) => originStyleInputHandler(e)}
            value={style.origin}
            class={inputStyle}
          />
        </label>
        <div class="flex gap-2 items-center justify-center">
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
                onChange={(e) => styleReversedToogleHandler(e)}
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
            class="bg-orange-500/70 hover:bg-orange-700/70 active:bg-orange-500/70 rounded-full px-3 text-white"
          >
            更改样式
          </button>
        </div>
      </form>
    </div>
  )
}

export default SendPane
