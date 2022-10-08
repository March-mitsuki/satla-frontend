// dependencies lib
import { createSignal, For, Match, Switch, createEffect } from "solid-js"

// local dependencies
import _pagetype from "../contexts/page-type"
import _subtitles from "../contexts/subtitles"
import _currentInfo from "@/components/contexts/current-info-ctx";

// type
import type { ParentComponent } from "solid-js"
import { Subtitle, FloatingElem } from "@/interfaces"
import type { c2sAddSubtitle, s2cEventMap } from "@/interfaces/ws"
import { wsHandler } from "@/controllers";

// for test
import dummySub from "@/assets/dummy-subtitles"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const CheckArea: ParentComponent<{
  ws: WebSocket | undefined
}> = (props) => {
  // pagetype: false = 翻译, true = 校对, default = false
  const { pagetype, isBilingual, canOrder } = _pagetype
  const {
    subtitles, setSubtitles,
    floatingElem, setFloatingElem,
  } = _subtitles
  const { setUserList } = _currentInfo
  const [ isComposition, setIsComposition ] = createSignal(false)

  if (typeof subtitles() === "undefined") {
    setSubtitles(dummySub)
  }
  let initialFloatingElem: FloatingElem[] = [];
  for (let i = 0; i < (subtitles() as Subtitle[]).length; i++) {
    const elem = (subtitles() as Subtitle[])[i]
    const floatingElem: FloatingElem = {
      id: elem.id,
      zIndex: "auto",
      position: "static",
      isFloating: false,
      y: 0,
      hidden: false,
      isDrop: false,
    }
    initialFloatingElem.push(floatingElem)
  }
  if (typeof floatingElem() === "undefined") {
    setFloatingElem(initialFloatingElem)
  }

  // 定义复用函数, 便于维护
  const addUp = (idx: number, subtitle: Subtitle) => {
    const newSub: Subtitle = new Subtitle()
    const newFloatingElem: FloatingElem = new FloatingElem()
    newFloatingElem.id = newSub.id

    floatingElem()?.splice(idx, 0, newFloatingElem)
    setFloatingElem(floatingElem()?.map(x => x))

    subtitles()?.splice(idx, 0, newSub)
    setSubtitles(subtitles()?.map(x => x))
  }
  const addDown = (idx: number, subtitle: Subtitle) => {
    const newSub: Subtitle = new Subtitle()
    const newFloatingElem: FloatingElem = new FloatingElem()
    newFloatingElem.id = newSub.id

    floatingElem()?.splice(idx + 1, 0, newFloatingElem)
    setFloatingElem(floatingElem()?.map(x => x))

    subtitles()?.splice(idx + 1, 0, newSub)
    setSubtitles(subtitles()?.map(x => x))
  }


  const postChange = (subtitle: Subtitle) => {
    if (typeof(props.ws) === "undefined") {
      window.alert("正在连接到服务器, 请稍等")
      return
    }
    const postSubtitle: c2sAddSubtitle = {
      head: {
        cmd: "addSubtitle"
      },
      body: {
        data: subtitle
      }
    }
    const postData = new TextEncoder().encode(JSON.stringify(postSubtitle))
    props.ws.send(postData)
    console.log("posted:", postData);
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
        addUp(idx, subtitle)
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        addDown(idx, subtitle)
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
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !isComposition()) {
      e.preventDefault()

      subtitle.subtitle = formElem.subtitle.value
      subtitle.origin = formElem.origin.value
      postChange(subtitle)
    }
  }

  const addUpClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    addUp(idx, subtitle)
  }
  const addDownClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    addDown(idx, subtitle)
  }

  const delClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    setSubtitles(subtitles()?.filter(elem => elem.id !== subtitle.id))
  }

  const startDragHandler = (
    e: MouseEvent & { currentTarget: HTMLDivElement },
    idx: number,
    subtitle: Subtitle
  ) => {
    if (canOrder() === false) {
      return
    }
    let belowElem: Element | null
    const currentFormWrapper = document.getElementById(subtitle.id.toString() + "-form")

    let shiftY: number;
    shiftY = e.clientY - (currentFormWrapper as HTMLDivElement).getBoundingClientRect().top;
    const docHeight = document.documentElement.clientHeight;
    // 拖动之后clientrect的计算会出错, 还不知道为啥
    console.log((currentFormWrapper as HTMLDivElement).getBoundingClientRect().top);

    // 拖动后的form wrapper
    let afterFormWrapper: ParentNode | null | undefined;

    onmousemove = (e: MouseEvent) => {
      e.preventDefault()

      // const moveY = e.pageY - shiftY
      const moveY = e.clientY
      if (
        moveY + (currentFormWrapper as HTMLDivElement).offsetHeight <= docHeight
        && moveY >= 0
      ) {
        // 开始拖拽
        const deepcopy = (floatingElem() as FloatingElem[]).map(x => x)
        deepcopy[idx].zIndex = 1000
        deepcopy[idx].position = "absolute"
        deepcopy[idx].isFloating = true,
        deepcopy[idx].y = moveY
        deepcopy[idx].hidden = true
        setFloatingElem(deepcopy)
      }
      // 拖动瞬间设置元素为hidden, 获取下方要素
      belowElem = document.elementFromPoint(e.clientX, e.clientY)
      if (
        moveY + (currentFormWrapper as HTMLDivElement).offsetHeight <= docHeight
        && moveY >= 0
      ) {
        // 成功获取之后再设置hidden为false, 展现元素给用户
        const deepcopy = (floatingElem() as FloatingElem[]).map(x => x)
        deepcopy[idx].hidden = false
        setFloatingElem(deepcopy)
      }
      if (!belowElem) {
        return
      }

      if (
        belowElem instanceof HTMLDivElement
        && belowElem.closest("form")
      ) {
        afterFormWrapper = belowElem.closest("form")?.parentNode
        if (afterFormWrapper) {
          const elemId = Number((afterFormWrapper as HTMLDivElement).id.replace("-form", ""))
          const reorderIdx = (floatingElem() as FloatingElem[]).findIndex(elem => elem.id === elemId)
          const spliceElem = (floatingElem() as FloatingElem[])[reorderIdx]
          spliceElem.id = (floatingElem() as FloatingElem[])[reorderIdx].id
          spliceElem.isDrop = true
          floatingElem()?.splice(reorderIdx, 1, spliceElem)
        }
      }
      if (
        belowElem instanceof HTMLDivElement
        && !belowElem.closest("form")
      ) {
        setFloatingElem(floatingElem()?.map(elem => {
          elem.isDrop = false
          return elem
        }))
      }
    }

    onmouseup = () => {
      if (
        belowElem instanceof HTMLDivElement
        && belowElem.closest("form")
      ) {
        // 如果放开鼠标时在指定元素上
        afterFormWrapper = belowElem.closest("form")?.parentNode
        const elemId = Number((afterFormWrapper as HTMLDivElement).id.replace("-form", ""))
        const reorderIdx = (floatingElem() as FloatingElem[]).findIndex(elem => elem.id === elemId)

        if (reorderIdx > idx) {
          // 从前往后拖
          const dc_floatingElem = floatingElem()?.map(x => x)
          if (!dc_floatingElem) {
            return
          }
          dc_floatingElem[idx].zIndex = "auto"
          dc_floatingElem[idx].position = "static"
          dc_floatingElem[idx].isFloating = false
          dc_floatingElem[idx].y = 0
          dc_floatingElem[idx].isDrop = false
          dc_floatingElem[idx].hidden = false
          dc_floatingElem[reorderIdx].isDrop = false
          dc_floatingElem.splice(idx, 1)
          dc_floatingElem.splice(reorderIdx-1, 0, {
            id: (subtitles() as Subtitle[])[idx].id,
            zIndex: "auto",
            position: "static",
            isFloating: false,
            y: 0,
            hidden: false,
            isDrop: false,
          })
          setFloatingElem(dc_floatingElem)

          const dc_subtitles = (subtitles() as Subtitle[]).map(x => x)
          dc_subtitles.splice(idx, 1)
          dc_subtitles.splice(reorderIdx-1, 0, subtitle)
          setSubtitles(dc_subtitles)
        } else {
          // 从后往前拖
          const dc_floatingElem = floatingElem()?.map(x => x)
          if (!dc_floatingElem) {
            return
          }
          dc_floatingElem[idx].zIndex = "auto"
          dc_floatingElem[idx].position = "static"
          dc_floatingElem[idx].isFloating = false
          dc_floatingElem[idx].y = 0
          dc_floatingElem[idx].isDrop = false
          dc_floatingElem[idx].hidden = false
          dc_floatingElem[reorderIdx].isDrop = false
          dc_floatingElem.splice(idx, 1)
          dc_floatingElem.splice(reorderIdx, 0, {
            id: (subtitles() as Subtitle[])[idx].id,
            zIndex: "auto",
            position: "static",
            isFloating: false,
            y: 0,
            hidden: false,
            isDrop: false,
          })
          setFloatingElem(dc_floatingElem)
  
          const dc_subtitles = (subtitles() as Subtitle[]).map(x => x)
          dc_subtitles.splice(idx, 1)
          dc_subtitles.splice(reorderIdx, 0, subtitle)
          setSubtitles(dc_subtitles)
        }
      } else {
        // 如果不在指定元素上
        const dc_floatingElem = floatingElem()?.map(x => x)
        if (!dc_floatingElem) {
          return
        }
        dc_floatingElem[idx].zIndex = "auto"
        dc_floatingElem[idx].position = "static"
        dc_floatingElem[idx].isFloating = false
        dc_floatingElem[idx].y = 0
        dc_floatingElem[idx].hidden = false
        setFloatingElem(dc_floatingElem)
      }
      console.log(floatingElem(), subtitles());

      onmousemove = () => null
      onmouseup = () => null
    }
  }

  createEffect(() => {
    if (!props.ws) {
      return
    }
    props.ws.onmessage = (evt) => {
      const data: s2cEventMap = JSON.parse(evt.data)
      switch (data.head.cmd) {
        case "sChangeUser":
          wsHandler.addUserHandler(data, setUserList)
          break;
        case "sGetRoomSubtitles":
          wsHandler.getRoomSubHandler(data, setSubtitles)
          break;
        default:
          console.log("unknow cmd: ", data);
          break;
      }
    }
  })

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
              "z-index": (floatingElem() as FloatingElem[])[idx()].zIndex,
              "position": `${(floatingElem() as FloatingElem[])[idx()].position}`,
              "top": `${(floatingElem() as FloatingElem[])[idx()].y}px`,
            }}
            classList={{
              "mt-2": (floatingElem() as FloatingElem[])[idx()].isDrop === false,
              "mt-2 border-t-2 border-sky-500": (floatingElem() as FloatingElem[])[idx()].isDrop === true,
            }}
            hidden={(floatingElem() as FloatingElem[])[idx()].hidden}
          >
            <form
              onCompositionStart={() => setIsComposition(true)}
              onCompositionEnd={() => setIsComposition(false)}
              onKeyDown={(e) => formKeyDownHander(e, idx(), elem)}
              onSubmit={(e) => onSubmitHandler(e, idx(), elem)}
              class="flex px-2 gap-2 items-center"
            >
              {/* <button onClick={() => console.log(afterFormWrapperRefs[idx()])}>C-me</button> */}
              <Switch fallback={
                <div
                  onMouseDown={(e) => startDragHandler(e, idx(), elem)}
                  classList={{
                    "cursor-move flex gap-3 w-[150px] items-center px-1 rounded-md bg-orange-500/70 select-none": canOrder() === true,
                    "flex gap-3 w-[150px] items-center px-1 rounded-md bg-orange-500/70 select-none": canOrder() === false,
                  }}
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
                  <div
                    onMouseDown={(e) => startDragHandler(e, idx(), elem)}
                    classList={{
                      "cursor-move flex gap-3 w-[150px] items-center px-1 rounded-md bg-gray-500/70 select-none": canOrder() === true,
                      "flex gap-3 w-[150px] items-center px-1 rounded-md bg-gray-500/70 select-none": canOrder() === false,
                    }}
                  >
                    <div class="flex-1">
                      12:50:23
                    </div>
                    <div class="flex-1 truncate text-center">
                      发送aaasd
                    </div>
                  </div>
                </Match>
                <Match when={elem.checked_by !== null}>
                  <div
                    onMouseDown={(e) => startDragHandler(e, idx(), elem)}
                    classList={{
                      "cursor-move flex gap-3 w-[150px] items-center px-1 rounded-md bg-green-500/70 select-none": canOrder() === true,
                      "flex gap-3 w-[150px] items-center px-1 rounded-md bg-green-500/70 select-none": canOrder() === false,
                    }}
                  >
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
