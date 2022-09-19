import { For, Match, Switch, createSignal } from "solid-js"

import _pagetype from "../contexts/page-type"
import _subtitles from "../contexts/subtitles"

import type { ParentComponent } from "solid-js"
import { Subtitle } from "@/interfaces"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

type FloatingElem = {
  zIndex: number | "auto",
  position: "static" | "relative" | "absolute" | "sticky" | "fixed",
  isFloating: boolean,
  x: number,
  y: number,
  hidden: boolean,
}

const CheckArea: ParentComponent<{
  subtitles: Subtitle[]
  ws: WebSocket
}> = (props) => {
  // pagetype: false = 翻译, true = 校对, default = false
  const { pagetype, isBilingual } = _pagetype
  const { subtitles, setSubtitles } = _subtitles

  let initialFloatingElem: FloatingElem[] = [];
  for (let i = 0; i < subtitles().length; i++) {
    const floatingElem: FloatingElem = {
      zIndex: "auto",
      position: "static",
      isFloating: false,
      x: 0,
      y: 0,
      hidden: false
    }
    initialFloatingElem.push(floatingElem)
  }
  const [floatingElem, setFloatingElem] = createSignal<FloatingElem[]>(initialFloatingElem)


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
      // shift + 小键盘上下 快捷键新建字幕
      if (e.key === "ArrowUp") {
        e.preventDefault()
        const newSub: Subtitle = new Subtitle()
        subtitles().splice(idx, 0, newSub)
        const deepcopy = subtitles().map(x => x)
        setSubtitles(deepcopy)
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        const newSub: Subtitle = new Subtitle()
        subtitles().splice(idx + 1, 0, newSub)
        const deepcopy = subtitles().map(x => x)
        setSubtitles(deepcopy)
      }
      // shift + enter 移动到下一行
      if (e.key === "Enter") {
        e.preventDefault()
        if (document.activeElement?.getAttribute("name") === "subtitle") {
          document.getElementById(`${idx+1}-sub`)?.focus()
        } else {
          document.getElementById(`${idx+1}-ori`)?.focus()
        }
      }
    }
    if (e.ctrlKey) {
      // ctrl + enter 移动到上一行
      if (e.key === "Enter") {
        e.preventDefault()
        if (document.activeElement?.getAttribute("name") === "subtitle") {
          document.getElementById(`${idx-1}-sub`)?.focus()
        } else {
          document.getElementById(`${idx-1}-ori`)?.focus()
        }
      }
    }
    // 按回车提交
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()

      subtitle.subtitle = formElem.subtitle.value
      subtitle.origin = formElem.origin.value
      postChange(subtitle)
    }
  }

  const addUpClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    const newSub: Subtitle = new Subtitle()
    subtitles().splice(idx, 0, newSub)
    const deepcopy = subtitles().map(x => x)
    setSubtitles(deepcopy)
  }
  const addDownClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    const newSub: Subtitle = new Subtitle()
    subtitles().splice(idx + 1, 0, newSub)
    const deepcopy = subtitles().map(x => x)
    setSubtitles(deepcopy)
  }

  const delClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    setSubtitles(subtitles().filter(elem => elem.id !== subtitle.id))
  }

  const startDragHandler = (
    e: MouseEvent & { currentTarget: HTMLDivElement },
    idx: number,
    elem: Subtitle
  ) => {
    let belowElem: Element | null
    const currentForm = document.getElementById(elem.id.toString() + "-form")

    let shiftX: number;
    let shiftY: number;
    shiftX = e.clientX - (currentForm as HTMLFormElement).getBoundingClientRect().left;
    shiftY = e.clientY - (currentForm as HTMLFormElement).getBoundingClientRect().top; 
    const docHeight = document.documentElement.clientHeight;
    const docWidth = document.documentElement.clientWidth;

    onmousemove = (e: MouseEvent) => {
      e.preventDefault()

      const moveX = e.pageX - shiftX
      const moveY = e.pageY - shiftY
      if (
        moveX + (currentForm as HTMLFormElement).offsetWidth <= docWidth
        && moveY + (currentForm as HTMLFormElement).offsetHeight <= docHeight
        && moveX >= 0
        && moveY >= 0
      ) {
        // 开始拖拽
        const deepcopy = floatingElem().map(x => x)
        deepcopy[idx] = {
          zIndex: 1000,
          position: "absolute",
          isFloating: true,
          x: moveX,
          y: moveY,
          hidden: true,
        }
        setFloatingElem(deepcopy)
      }
      // 瞬间设置拖动为hidden, 获取下方要素
      belowElem = document.elementFromPoint(e.clientX, e.clientY)
      if (
        moveX + (currentForm as HTMLFormElement).offsetWidth <= docWidth
        && moveY + (currentForm as HTMLFormElement).offsetHeight <= docHeight
        && moveX >= 0
        && moveY >= 0
      ) {
        // 成功获取之后再设置hidden为false, 展现元素给用户
        const deepcopy = floatingElem().map(x => x)
        deepcopy[idx] = {
          zIndex: 1000,
          position: "absolute",
          isFloating: true,
          x: moveX,
          y: moveY,
          hidden: false,
        }
        setFloatingElem(deepcopy)
      }
    }

    onmouseup = () => {
      const deepcopy = floatingElem().map(x => x)
      deepcopy[idx] = {
        zIndex: "auto",
        position: "static",
        isFloating: false,
        x: 0,
        y: 0,
        hidden: false,
      }
      setFloatingElem(deepcopy)

      onmousemove = () => null
      onmouseup = () => null
    }
  }

  return (
    <div
      class="h-full pb-4 overflow-auto flex flex-col"
    >
      <For each={subtitles()}>{(elem, idx) => {
        console.log("creat For!");
        return (
          <div
            id={`${elem.id}-form`}
            style={{
              "z-index": floatingElem()[idx()].zIndex,
              "position": `${floatingElem()[idx()].position}`,
              "left": `${floatingElem()[idx()].x}px`,
              "top": `${floatingElem()[idx()].y}px`,
            }}
            class="mt-2"
            hidden={floatingElem()[idx()].hidden}
          >
            <form
              onKeyDown={(e) => formKeyDownHander(e, idx(), elem)}
              onSubmit={(e) => onSubmitHandler(e, idx(), elem)}
              class="flex px-2 gap-2 items-center"
            >
              {/* <button onClick={() => console.log(formRefs[idx()])}>ClickMe</button> */}
              <Switch fallback={
                <div
                  onMouseDown={(e) => startDragHandler(e, idx(), elem)}
                  class="cursor-move flex gap-3 w-[150px] items-center px-1 rounded-md bg-orange-500/70 select-none"
                >
                  <div class="flex-1">
                    12:50:23
                  </div>
                  <div class="flex-1 truncate text-center">
                    翻译
                  </div>
                </div>
              }>
                <Match when={elem.send_time !== null}>
                  <div class="flex gap-3 w-[150px] items-center px-1 rounded-md bg-gray-500/70 select-none">
                    <div class="flex-1">
                      12:50:23
                    </div>
                    <div class="flex-1 truncate text-center">
                      发送aaasd
                    </div>
                  </div>
                </Match>
                <Match when={elem.checked_by !== null}>
                  <div class="flex gap-3 w-[150px] items-center px-1 rounded-md bg-green-500/70 select-none">
                    <div class="flex-1">
                      12:50:23
                    </div>
                    <div class="flex-1 truncate text-center">
                      校对asdadsssasdasd
                    </div>
                  </div>
                </Match>
              </Switch>
              <input
                id={idx() + "-sub"}
                type="text"
                name="subtitle"
                autocomplete="off"
                placeholder="请输入翻译"
                value={elem.subtitle}
                class={inputStyle}
              />
              <input
                id={idx() + "-ori"}
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
                onClick={(e) => addUpClickHandler(e, idx(), elem)}
                class="rounded-md p-1 bg-amber-500/70 hover:bg-amber-700/70 active:bg-amber-500/70"
              >
                {/* add up btn */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                </svg>
              </button>
              <button
                onClick={(e) => addDownClickHandler(e, idx(), elem)}
                class="rounded-md p-1 bg-amber-500/70 hover:bg-amber-700/70 active:bg-amber-500/70"
              >
                {/* add down btn */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
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
