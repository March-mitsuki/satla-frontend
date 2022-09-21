import { createSignal, For, Match, Switch } from "solid-js"

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
  const [checkMemo, setCheckMemo] = createSignal<string[]>([""])

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

  const addCheckMemo = (e: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    checkMemo().push("")
    // setCheckMemo(checkMemo())
  }

  const checkMemoKeyDownHandler = (
    e: KeyboardEvent & { currentTarget: HTMLFormElement},
    idx: number,
    _checkmemo: string
  ) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      const formElem = e.currentTarget
      _checkmemo = formElem.checkmemo.value
      checkMemo()[idx] = _checkmemo
      setCheckMemo(checkMemo().map(x => x))
    }
  }
  const checkMemoSubmitHandler = (
    e: Event & { currentTarget: HTMLFormElement},
    idx: number,
    _checkmemo: string
  ) => {
    e.preventDefault()
    const formElem = e.currentTarget
    _checkmemo = formElem.checkmemo.value
    checkMemo()[idx] = _checkmemo
    setCheckMemo(checkMemo().map(x => x))
  }

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
            <div 
              class="absolute -left-1 peer-checked:translate-x-6 transition"
            >
              <Switch>
                {/* 切换toggle的左右箭头 */}
                <Match when={pagetype() === false}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-orange-500/75 rounded-full drop-shadow"
                  >
                    <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
                  </svg>
                </Match>
                <Match when={pagetype() === true}>
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
      <Switch>
        <Match when={pagetype() === false}>
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
        </Match>
        <Match when={pagetype() === true}>
            <div
              ref={checkMeoWrapperRef}
              class="flex flex-col px-1 pb-2 gap-1 overflow-auto h-[calc(100%-35px)]"
            >
              <For each={checkMemo()}>{(elem, idx) =>
                <form
                  onKeyDown={(e) => checkMemoKeyDownHandler(e, idx(), elem)}
                  onSubmit={(e) => checkMemoSubmitHandler(e, idx(), elem)}
                  class="flex gap-1"
                >
                  <input
                    type="text"
                    name="checkmemo"
                    autocomplete="off"
                    placeholder="memo"
                    class={inputStyle}
                    value={elem}
                  />
                  <button
                    type="submit"
                    class="rounded-md p-1 bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70"
                  >
                    {/* submit btn */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => addCheckMemo(e)}
                    class="rounded-md p-1 bg-amber-500/70 hover:bg-amber-700/70 active:bg-amber-500/70"
                  >
                    {/* add down btn */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {checkMemo().splice(idx(), 1)}}
                    class="rounded-md p-1 bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70"
                  >
                    {/* del btn */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </form>
              }</For>
            </div>
        </Match>
      </Switch>
    </div>
  )
}

export default TranslatePane
