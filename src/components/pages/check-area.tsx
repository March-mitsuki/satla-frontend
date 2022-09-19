import { For, Match, Switch } from "solid-js"

import _pagetype from "../contexts/page-type"
import _subtitles from "../contexts/subtitles"

import type { ParentComponent } from "solid-js"
import { Subtitle } from "@/interfaces"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const CheckArea: ParentComponent<{
  subtitles: Subtitle[]
  ws: WebSocket
}> = (props) => {
  // pagetype: false = 翻译, true = 校对, default = false
  const { pagetype, isBilingual } = _pagetype
  const { subtitles, setSubtitles } = _subtitles

  const postChange = (subtitle: Subtitle) => {
    const sendData = new TextEncoder().encode(JSON.stringify(subtitle))
    console.log("will post:", subtitle);
    // props.ws.send(sendData)
  }

  const onSubmitHandler = (
    e: SubmitEvent & { currentTarget: HTMLFormElement},
    idx: number,
    subtitle: Subtitle
  ) => {
    e.stopPropagation()
    e.preventDefault()
    const formElem = e.currentTarget

    subtitle.subtitle = formElem.subtitle.value
    subtitle.origin = formElem.origin.value
    postChange(subtitle)
  }

  const formKeyDownHander = (
    e: KeyboardEvent & { currentTarget: HTMLFormElement},
    idx: number,
    subtitle: Subtitle
  ) => {
    const formElem = e.currentTarget

    if (e.shiftKey) {
      // shift + enter 快捷键新建字幕
      e.preventDefault()
      if (e.key === "Enter") {
        e.preventDefault()
        const newSub: Subtitle = new Subtitle()
        newSub.origin = "新建字幕"
        subtitles().splice(idx + 1, 0, newSub)
        const deepcopy = subtitles().map(x => x)
        setSubtitles(deepcopy)
      }
    }

    if (e.ctrlKey) {
      // ctrl + enter 移动到下一行
      e.preventDefault()
      if (e.key === "Enter") {
        e.preventDefault()
        if (document.activeElement?.getAttribute("name") === "subtitle") {
          document.getElementById(`${subtitle.id+1}-sub`)?.focus()
        } else {
          document.getElementById(`${subtitle.id+1}-ori`)?.focus()
        }
        
      }
    }

    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      console.log(e.key, "sigle");

      subtitle.subtitle = formElem.subtitle.value
      subtitle.origin = formElem.origin.value
      postChange(subtitle)
    }
  }

  const addClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    const newSub: Subtitle = new Subtitle()
    newSub.origin = "新建字幕"
    subtitles().splice(idx, 0, newSub)
    const deepcopy = subtitles().map(x => x)
    setSubtitles(deepcopy)
  }

  const delClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    setSubtitles(subtitles().filter(elem => elem.id !== subtitle.id))
  }

  return (
    <div
      class={
        pagetype()
        ? "h-full pb-4 overflow-auto flex flex-col"
        : "h-full pb-4 overflow-auto flex flex-col-reverse"
      }
    >
      <For each={subtitles()}>{(elem, idx) => {
        console.log("creat For!");
        return (
          <div class="mt-2">
            <form
              onKeyDown={(e) => formKeyDownHander(e, idx(), elem)}
              onSubmit={(e) => onSubmitHandler(e, idx(), elem)}
              class="flex px-2 gap-2 items-center"
            >
              <div class="px-1 rounded-md bg-sky-500/75 select-none">
                14:34:54
              </div>
              <Switch fallback={
                <div class="px-1 rounded-md bg-orange-500/75 select-none">
                  已翻译
                </div>
              }>
                <Match when={elem.send_time !== null}>
                  <div class="px-1 rounded-md bg-gray-500/75 select-none">
                    已发送
                  </div>
                </Match>
                <Match when={elem.checked_by !== null}>
                  <div class="px-1 rounded-md bg-green-500/75 select-none">
                    已校对
                  </div>
                </Match>
              </Switch>
              <input
                id={elem.id + "-sub"}
                type="text"
                name="subtitle"
                autocomplete="off"
                placeholder="请输入翻译"
                value={elem.subtitle}
                class={inputStyle}
              />
              <input
                id={elem.id + "-ori"}
                type="text"
                name="origin"
                autocomplete="off"
                placeholder="请输入原文"
                value={elem.origin}
                classList={{
                  [inputStyle]: isBilingual() === true,
                  "hidden": isBilingual() === false,
                }}
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
                onClick={(e) => addClickHandler(e, idx(), elem)}
                class="rounded-md p-1 bg-amber-500/70 hover:bg-amber-700/70 active:bg-amber-500/70"
              >
                {/* add btn */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
              <button
                onClick={(e) => delClickHandler(e, idx(), elem)}
                class="rounded-md p-1 bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70"
              >
                {/* del btn */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </form>
          </div>
        )}}</For>
    </div>
  )
}

export default CheckArea
