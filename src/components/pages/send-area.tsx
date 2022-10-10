// dependencies lib
import { createEffect, For, Match, Switch } from "solid-js"

// local dependencies
import _subtitles from "../contexts/subtitles"
import _currentInfo from "@/components/contexts/current-info-ctx";
import { wsHandler } from "@/controllers"

// type
import type { ParentComponent } from "solid-js"
import { Subtitle, FloatingElem } from "@/interfaces"
import type {
  c2sChangeSubtitle,
  s2cEventMap,
  s2cAddSubtitleBody,
} from "@/interfaces/ws"

// for test
import dummySub from "@/assets/dummy-subtitles"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const SendArea: ParentComponent<{
  ws: WebSocket | undefined,
}> = (props) => {
  const {
    subtitles, setSubtitles,
    floatingElem, setFloatingElem,
  } = _subtitles
  const { setUserList } = _currentInfo

  // 各种初始化操作
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
  // 更新逻辑: 监听用户操作 -> ws.send -> ws.onmessage -> 页面更新(启动更新函数)
  const addUp = (
    {
      idx,
      newSubId,
      project_id,
      checked_by,
    }:{
      idx: number,
      newSubId: number,
      project_id: number,
      checked_by: string,
    }
  ) => {
    const newSub: Subtitle = new Subtitle({
      id: newSubId,
      project_id: project_id,
      checked_by: checked_by,
      translated_by: checked_by,
    })
    const newFloatingElem: FloatingElem = new FloatingElem(newSubId)
    newFloatingElem.id = newSub.id

    floatingElem()?.splice(idx, 0, newFloatingElem)
    setFloatingElem(floatingElem()?.map(x => x))

    subtitles()?.splice(idx, 0, newSub)
    setSubtitles(subtitles()?.map(x => x))
  }
  const addDown = (
    {
      idx,
      newSubId,
      project_id,
      checked_by,
    }:{
      idx: number,
      newSubId: number,
      project_id: number,
      checked_by: string,
    }
  ) => {
    const newSub: Subtitle = new Subtitle({
      id: newSubId,
      project_id: project_id,
      checked_by: checked_by,
      translated_by: checked_by,
    })
    const newFloatingElem: FloatingElem = new FloatingElem(newSubId)
    newFloatingElem.id = newSub.id

    floatingElem()?.splice(idx + 1, 0, newFloatingElem)
    setFloatingElem(floatingElem()?.map(x => x))

    subtitles()?.splice(idx + 1, 0, newSub)
    setSubtitles(subtitles()?.map(x => x))
  }

  // poster函数
  const postChange = (subtitle: Subtitle) => {
    if (!props.ws) {
      console.log("props.ws is undifiend");
      return
    }
    const postSubtitle: c2sChangeSubtitle = {
      head: {
        cmd: "changeSubtitle"
      },
      body: {
        subtitle: subtitle
      }
    }
    const postData = new TextEncoder().encode(JSON.stringify(postSubtitle))
    props.ws.send(postData)
    console.log("subtitle posted:", subtitle);
  }

  // 更新函数
  const changeSubtitle = () => {

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
        wsHandler.addSubtitleUp({
          ws: props.ws,
          id: subtitle.id,
          idx: idx,
          project_id: subtitle.project_id
        })
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        wsHandler.addSubtitleDown({
          ws: props.ws,
          id: subtitle.id,
          idx: idx,
          project_id: subtitle.project_id
        })
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
    wsHandler.addSubtitleUp({
      ws: props.ws,
      id: subtitle.id,
      idx: idx,
      project_id: subtitle.project_id
    })
  }
  const addDownClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    wsHandler.addSubtitleDown({
      ws: props.ws,
      id: subtitle.id,
      idx: idx,
      project_id: subtitle.project_id
    })
  }

  const delClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    setSubtitles(subtitles()?.filter(elem => elem.id !== subtitle.id))
  }

  createEffect(() => {
    if (!props.ws) {
      return
    }
    props.ws.onmessage = (evt) => {
      const data: s2cEventMap = JSON.parse(evt.data)
      switch (data.head.cmd) {
        case "sChangeUser":
          wsHandler.addUser(data, setUserList)
          break;
        case "sGetRoomSubtitles":
          wsHandler.getRoomSubtitles(data, setSubtitles, setFloatingElem)
          break;
        case "sAddSubtitleUp":
          const addUpBody: s2cAddSubtitleBody = data.body
          addUp({
            idx: addUpBody.pre_subtitle_idx,
            newSubId: addUpBody.new_subtitle_id,
            project_id: addUpBody.project_id,
            checked_by: addUpBody.checked_by
          })
          break;
        case "sAddSubtitleDown":
          const addDownBody: s2cAddSubtitleBody = data.body
          addDown({
            idx: addDownBody.pre_subtitle_idx,
            newSubId: addDownBody.new_subtitle_id,
            project_id: addDownBody.project_id,
            checked_by: addDownBody.checked_by
          })
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
              onKeyDown={(e) => formKeyDownHander(e, idx(), elem)}
              onSubmit={(e) => onSubmitHandler(e, idx(), elem)}
              class="flex px-2 gap-2 items-center"
            >
              {/* <button onClick={() => console.log(afterFormWrapperRefs[idx()])}>C-me</button> */}
              <Switch fallback={
                <div
                  class="flex gap-3 w-[150px] items-center px-1 rounded-md bg-orange-500/70 select-none"
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
                    class="flex gap-3 w-[150px] items-center px-1 rounded-md bg-gray-500/70 select-none"
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
                    class="flex gap-3 w-[150px] items-center px-1 rounded-md bg-green-500/70 select-none"
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
              <button
                onClick={(e) => delClickHandler(e, idx(), elem)}
                class="rounded-md p-1 bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70"
              >
                {/* del btn */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
                type="submit"
                class="rounded-md p-1 bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70"
              >
                {/* submit btn */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
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
                class={inputStyle}
              />
            </form>
          </div>
        )}}</For>
    </div>
  )
}

export default SendArea
