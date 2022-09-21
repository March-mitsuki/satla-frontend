import { createSignal, Match, Switch } from "solid-js"

import _pagetype from "../contexts/page-type"
import _subtitles from "../contexts/subtitles"
import { Subtitle, FloatingElem } from "@/interfaces"

import type { Component } from "solid-js"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const SendPane: Component = () => {
  const [inputType, seInputType] = createSignal(false) // true = 输入, false = 发送
  const [sendType, setSendType] = createSignal(true) // true = 双语, false = 单语
  const {
    subtitles, setSubtitles,
    floatingElem, setFloatingElem,
  } = _subtitles

  const onSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement}) => {
    e.stopPropagation()
    e.preventDefault()

    const formElem = e.currentTarget
    if (inputType()) {
      // 输入
      console.log("输入");
      
      const newSub = new Subtitle()
      const newFloating = new FloatingElem()
      newSub.subtitle = formElem.subtitle.value
      newSub.origin = formElem.origin.value
      floatingElem()?.push(newFloating)
      setFloatingElem(floatingElem()?.map(x => x))
      subtitles()?.push(newSub)
      setSubtitles(subtitles()?.map(x => x))
    } else {
      // 发送
      console.log("发送");
      
      const newSub = new Subtitle()
      const newFloating = new FloatingElem()
      newSub.subtitle = formElem.subtitle.value
      newSub.origin = formElem.origin.value
      floatingElem()?.push(newFloating)
      setFloatingElem(floatingElem()?.map(x => x))
      subtitles()?.push(newSub)
      setSubtitles(subtitles()?.map(x => x))
    }
    formElem.subtitle.value = ""
    formElem.origin.value = ""
    document.getElementById(((subtitles() as Subtitle[]).length-1).toString() + "-sub")?.scrollIntoView()
  }

  const inputTypeToggleHander = (e: Event & { currentTarget: HTMLInputElement }) => {
    seInputType(!inputType())
  }
  const sendTypeToggleHandler = (e: Event & { currentTarget: HTMLInputElement }) => {
    setSendType(!sendType())
  }

  return (
    <div class="mt-1 flex flex-col gap-1">
      <div class="flex gap-2 px-1 justify-center">
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={sendType()}
              onChange={(e) => sendTypeToggleHandler(e)}
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
        <div class="border-l-2"></div>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          发送
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={inputType()}
              onChange={(e) => inputTypeToggleHander(e)}
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
      </div>
      <form
        onSubmit={(e) => onSubmitHandler(e)}
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
    </div>
  )
}

export default SendPane