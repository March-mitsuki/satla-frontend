import { createSignal, Match, Switch } from "solid-js"

import _pagetype from "../contexts/page-type"
import _subtitles from "../contexts/subtitles"
import { Subtitle, FloatingElem } from "@/interfaces"

import type { Component } from "solid-js"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const TranslatePane: Component = () => {
  const {
    // pagetype: false = 翻译, true = 校对, default = false
    pagetype, switchPagetype,
    // bilingual: 是否显示双语
    isBilingual, switchBilingual,
    // canOrder: 是否可以拖动排序
    canOrder, switchCanOrder,
  } = _pagetype
  const {
    subtitles, setSubtitles,
    floatingElem, setFloatingElem,
  } = _subtitles

  const onSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement}) => {
    e.stopPropagation()
    e.preventDefault()
    const formElem = e.currentTarget
    const newSub = new Subtitle()
    const newFloating = new FloatingElem()
    newSub.subtitle = formElem.subtitle.value
    newSub.origin = formElem.origin.value
    floatingElem()?.push(newFloating)
    setFloatingElem(floatingElem()?.map(x => x))
    subtitles()?.push(newSub)
    setSubtitles(subtitles()?.map(x => x))
    formElem.subtitle.value = ""
    formElem.origin.value = ""
    document.getElementById(((subtitles() as Subtitle[]).length-1).toString() + "-sub")?.scrollIntoView()
  }

  const bilingualToggleHandler = (e: Event & { currentTarget: HTMLInputElement }) => {
    switchBilingual()
  }

  const orderToggleHandler = (e: Event & { currentTarget: HTMLInputElement }) => {
    switchCanOrder()
  }

  const inputToggleHandler = (e: Event & { currentTarget: HTMLInputElement }) => {
    switchPagetype()
  }

  return (
    <div class="mt-1 flex flex-col gap-1">
      <div class="flex gap-2 px-1 justify-center">
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={isBilingual()}
              onChange={(e) => bilingualToggleHandler(e)}
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
              onChange={(e) => orderToggleHandler(e)}
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
              onChange={(e) => inputToggleHandler(e)}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div 
              class="absolute -left-1 peer-checked:translate-x-6 transition"
            >
              <Switch>
                {/* 切换toggle的左右箭头 */}
                <Match when={!pagetype()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-orange-500/75 rounded-full drop-shadow"
                  >
                    <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
                  </svg>
                </Match>
                <Match when={pagetype()}>
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
          校对
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
          classList={{
            [inputStyle]: isBilingual() === true,
            "hidden": isBilingual() === false,
          }}
        />
        <button
          type="submit"
          class="bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-full px-3 text-white"
        >输入</button>
      </form>
    </div>
  )
}

export default TranslatePane
