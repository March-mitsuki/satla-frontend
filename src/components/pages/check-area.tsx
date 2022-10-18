// dependencies lib
import { createSignal, For, Match, Switch, createEffect } from "solid-js"

// local dependencies
import _pagetype from "../contexts/page-type"
import _subtitles from "../contexts/subtitles"
import _currentInfo from "@/components/contexts/current-info-ctx";

// type
import type { ParentComponent } from "solid-js"
import { Subtitle, AttachedInfo } from "@/interfaces"
import type {
  s2cEventMap,
  s2cDeleteSubtitleBody,
  s2cReorderSubBody,
  s2cAddTranslatedSubtitleBody,
  s2cSendSubtitleBody,
} from "@/interfaces/ws"
import { wsOn, wsSend } from "@/controllers";

// for test
import dummySub from "@/assets/dummy-subtitles"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const CheckArea: ParentComponent<{
  ws: WebSocket | undefined
}> = (props) => {
  const { pagetype, isBilingual, canOrder } = _pagetype
  const {
    subtitles, setSubtitles,
    attachedInfo, setAttachedInfo,
  } = _subtitles
  const { currentUser, setUserList } = _currentInfo
  const [ isComposition, setIsComposition ] = createSignal(false)

  if (typeof subtitles() === "undefined") {
    setSubtitles(dummySub)
  }
  if (typeof attachedInfo() === "undefined") {
    // attachedInfo会根据首次传进来的subtitles进行设定
    let initialAttachedInfo: AttachedInfo[] = [];
    for (let i = 0; i < (subtitles() as Subtitle[]).length; i++) {
      const elem = (subtitles() as Subtitle[])[i]
      const attachedInfo = new AttachedInfo(elem.id)
      initialAttachedInfo.push(attachedInfo)
    }
    setAttachedInfo(initialAttachedInfo)
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
    subtitle.checked_by = currentUser().user_name
    wsSend.changeSubtitle({ws: props.ws, subtitle: subtitle})
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
        wsSend.addSubtitleUp({
          ws: props.ws,
          id: subtitle.id,
          idx: idx,
          project_id: subtitle.project_id
        })
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        wsSend.addSubtitleDown({
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
        } else if (document.activeElement?.getAttribute("name") === "origin") {
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
        } else if (document.activeElement?.getAttribute("name") === "origin") {
          document.getElementById(`${idx-1}-ori`)?.focus()
        }
      }
    }
    // 按回车提交
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !isComposition()) {
      e.preventDefault()

      subtitle.subtitle = formElem.subtitle.value
      subtitle.origin = formElem.origin.value
      subtitle.checked_by = currentUser().user_name
      wsSend.changeSubtitle({ws: props.ws, subtitle: subtitle})
    }
  }

  const addUpClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    wsSend.addSubtitleUp({
      ws: props.ws,
      id: subtitle.id,
      idx: idx,
      project_id: subtitle.project_id
    })
  }
  const addDownClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    wsSend.addSubtitleDown({
      ws: props.ws,
      id: subtitle.id,
      idx: idx,
      project_id: subtitle.project_id
    })
  }

  const delClickHandler = (e: MouseEvent, idx: number, subtitle: Subtitle) => {
    e.preventDefault()
    wsSend.deleteSubtitle(props.ws, subtitle)
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
    const currentFormWrapper = document.getElementById(`${subtitle.id}-wrapper`)

    let shiftY: number;
    shiftY = e.clientY - (currentFormWrapper as HTMLDivElement).getBoundingClientRect().top;
    const docHeight = document.documentElement.clientHeight;
    // 拖动之后clientrect的计算会出错, 还不知道为啥
    // console.log((currentFormWrapper as HTMLDivElement).getBoundingClientRect().top);

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
        const deepcopy = (attachedInfo() as AttachedInfo[]).map(x => x)
        deepcopy[idx].zIndex = 1000
        deepcopy[idx].position = "absolute"
        deepcopy[idx].isFloating = true,
        deepcopy[idx].y = moveY
        deepcopy[idx].hidden = true
        setAttachedInfo(deepcopy)
      }
      // 拖动瞬间设置元素为hidden, 获取下方要素
      belowElem = document.elementFromPoint(e.clientX, e.clientY)
      if (
        moveY + (currentFormWrapper as HTMLDivElement).offsetHeight <= docHeight
        && moveY >= 0
      ) {
        // 成功获取之后再设置hidden为false, 展现元素给用户
        const deepcopy = (attachedInfo() as AttachedInfo[]).map(x => x)
        deepcopy[idx].hidden = false
        setAttachedInfo(deepcopy)
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
          const dropElemId = Number((afterFormWrapper as HTMLDivElement).id.replace("-wrapper", ""))
          const reorderIdx = (attachedInfo() as AttachedInfo[]).findIndex(elem => elem.id === dropElemId)
          const spliceElem = (attachedInfo() as AttachedInfo[])[reorderIdx]
          spliceElem.id = (attachedInfo() as AttachedInfo[])[reorderIdx].id
          spliceElem.isDrop = true
          attachedInfo()?.splice(reorderIdx, 1, spliceElem)
        }
      }
      if (
        belowElem instanceof HTMLDivElement
        && !belowElem.closest("form")
      ) {
        setAttachedInfo(attachedInfo()?.map(elem => {
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
        const dropElemId = Number((afterFormWrapper as HTMLDivElement).id.replace("-wrapper", ""))
        const reorderIdx = (attachedInfo() as AttachedInfo[]).findIndex(elem => elem.id === dropElemId)

        if (reorderIdx > idx) {
          // 从前往后拖
          wsSend.reorderSubFront({
            ws: props.ws,
            drag_id: subtitle.id,
            drop_id: dropElemId,
            project_id: subtitle.project_id,
          })
          reorderSubFrontSelf(idx, reorderIdx, subtitle)
        } else {
          // 从后往前拖
          wsSend.reorderSubBack({
            ws: props.ws,
            drag_id: subtitle.id,
            drop_id: dropElemId,
            project_id: subtitle.project_id,
          })
          reorderSubBackSelf(idx, reorderIdx, subtitle)
        }
      } else {
        // 如果不在指定元素上
        const dc_attachedInfo = attachedInfo()?.map(x => x)
        if (!dc_attachedInfo) {
          return
        }
        dc_attachedInfo[idx].zIndex = "auto"
        dc_attachedInfo[idx].position = "static"
        dc_attachedInfo[idx].isFloating = false
        dc_attachedInfo[idx].y = 0
        dc_attachedInfo[idx].hidden = false
        setAttachedInfo(dc_attachedInfo)
      }

      onmousemove = () => null
      onmouseup = () => null
    }
  }

  const onCompoStartHandler = (idx: number) => {
    setIsComposition(true)
    const dc_attachedInfo = attachedInfo()?.map(x => x)
    if (!dc_attachedInfo) {
      return
    }
    dc_attachedInfo[idx].changeStatus = 1
    setAttachedInfo(dc_attachedInfo)
  }

  const onInputHandler = (idx: number) => {
    const dc_attachedInfo = attachedInfo()?.map(x => x)
    if (!dc_attachedInfo) {
      return
    }
    dc_attachedInfo[idx].changeStatus = 1
    setAttachedInfo(dc_attachedInfo)
  }

  const reorderSubFrontSelf = (
    idx: number,
    reorderIdx: number,
    dragSubtitle: Subtitle,
  ) => {
    const dc_attachedInfo = attachedInfo()?.map(x => x)
    if (!dc_attachedInfo) {
      return
    }
    dc_attachedInfo[idx].zIndex = "auto"
    dc_attachedInfo[idx].position = "static"
    dc_attachedInfo[idx].isFloating = false
    dc_attachedInfo[idx].y = 0
    dc_attachedInfo[idx].isDrop = false
    dc_attachedInfo[idx].hidden = false
    dc_attachedInfo[reorderIdx].isDrop = false
    dc_attachedInfo.splice(idx, 1)
    dc_attachedInfo.splice(reorderIdx-1, 0, {
      id: (subtitles() as Subtitle[])[idx].id,
      zIndex: "auto",
      position: "static",
      isFloating: false,
      y: 0,
      hidden: false,
      isDrop: false,
      isEditing: (attachedInfo() as AttachedInfo[])[idx].isEditing,
      editingUser: (attachedInfo() as AttachedInfo[])[idx].editingUser,
      changeStatus: (attachedInfo() as AttachedInfo[])[idx].changeStatus,
    })
    setAttachedInfo(dc_attachedInfo)

    const dc_subtitles = (subtitles() as Subtitle[]).map(x => x)
    dc_subtitles.splice(idx, 1)
    dc_subtitles.splice(reorderIdx-1, 0, dragSubtitle)
    setSubtitles(dc_subtitles)
  }

  const reorderSubBackSelf = (
    idx: number,
    reorderIdx: number,
    dragSubtitle: Subtitle,
  ) => {
    const dc_attachedInfo = attachedInfo()?.map(x => x)
    if (!dc_attachedInfo) {
      return
    }
    dc_attachedInfo[idx].zIndex = "auto"
    dc_attachedInfo[idx].position = "static"
    dc_attachedInfo[idx].isFloating = false
    dc_attachedInfo[idx].y = 0
    dc_attachedInfo[idx].isDrop = false
    dc_attachedInfo[idx].hidden = false
    dc_attachedInfo[reorderIdx].isDrop = false
    dc_attachedInfo.splice(idx, 1)
    dc_attachedInfo.splice(reorderIdx, 0, {
      id: (subtitles() as Subtitle[])[idx].id,
      zIndex: "auto",
      position: "static",
      isFloating: false,
      y: 0,
      hidden: false,
      isDrop: false,
      isEditing: (attachedInfo() as AttachedInfo[])[idx].isEditing,
      editingUser: (attachedInfo() as AttachedInfo[])[idx].editingUser,
      changeStatus: (attachedInfo() as AttachedInfo[])[idx].changeStatus,
    })
    setAttachedInfo(dc_attachedInfo)

    const dc_subtitles = (subtitles() as Subtitle[]).map(x => x)
    dc_subtitles.splice(idx, 1)
    dc_subtitles.splice(reorderIdx, 0, dragSubtitle)
    setSubtitles(dc_subtitles)
  }

  createEffect(() => {
    if (!props.ws) {
      return
    }
    // 更新逻辑: 监听用户操作 -> ws.send -> ws.onmessage -> 页面更新(启动更新函数)
    props.ws.onmessage = (evt) => {
      const data: s2cEventMap = JSON.parse(evt.data)
      switch (data.head.cmd) {
        case "sChangeUser":
          wsOn.addUser(data, setUserList)
          break;
        case "sGetRoomSubtitles":
          wsOn.getRoomSubtitles(data)
          break;
        case "sAddSubtitleUp":
          wsOn.addSubtitleUp(data)
          break;
        case "sAddSubtitleDown":
          wsOn.addSubtitleDown(data)
          break;
        case "sChangeSubtitle":
          wsOn.changeSubtitle(data)
          break;
        case "sEditStart":
          wsOn.editStart(data)
          break;
        case "sEditEnd":
          wsOn.editEnd(data)
          break;
        case "sAddTransSub":
          wsOn.addTranslatedSub(data)
          const addTranslatedSubBody: s2cAddTranslatedSubtitleBody = data.body
          if (addTranslatedSubBody.new_subtitle.translated_by === currentUser().user_name) {
            // 如果是自己加的行, 那么加了之后清空translate-form (位于同一page不同components)
            const translateForm = document.getElementById("translate-form");
            (translateForm as HTMLFormElement).subtitle.value = "";
            (translateForm as HTMLFormElement).origin.value = "";
          }
          if (pagetype() === false) {
            // 如果pagetype是翻译, 那么滚动到视野中
            document.getElementById(((subtitles() as Subtitle[]).length-1).toString() + "-sub")?.scrollIntoView()
          }
          break;
        case "sDeleteSubtitle":
          const deleteSubBody: s2cDeleteSubtitleBody = data.body
          if (!deleteSubBody.status) {
            window.alert("delete failed, please check the server side");
            return
          }
          wsOn.deleteSubtitle(deleteSubBody.subtitle_id)
          break;
        case "sReorderSubFront":
          const reorderFrontBody: s2cReorderSubBody = data.body
          if (reorderFrontBody.operation_user === currentUser().user_name) {
            if (!reorderFrontBody.status) {
              // 如果是自己操作, 那么成功了则什么都不做, 失败了则通知失败
              window.alert("拖动失败, 请刷新重试")
            }
          } else {
            if (reorderFrontBody.status) {
              // 若是别人操作, 则成功了换行, 失败了什么都不做
              wsOn.reorderSubFrontOther({
                drag_id: reorderFrontBody.drag_id,
                drop_id: reorderFrontBody.drop_id,
              })
            }
          }
          break;
        case "sReorderSubBack":
          const reorderBackBody: s2cReorderSubBody = data.body
          if (reorderBackBody.operation_user === currentUser().user_name) {
            if (!reorderBackBody.status) {
              window.alert("拖动失败, 请刷新重试")
            }
          } else {
            if (reorderBackBody.status) {
              wsOn.reorderSubBackOther({
                drag_id: reorderBackBody.drag_id,
                drop_id: reorderBackBody.drop_id,
              })
            }
          }
          break;
        case "sSendSubtitle":
          const sendSubtitleBody: s2cSendSubtitleBody = data.body
          if (!sendSubtitleBody.status) {
            console.log("send subtitle failed, please check the server side");
            return
          }
          wsOn.deleteSubtitle(sendSubtitleBody.subtitle.id)
          break;
        case "heartBeat":
          console.log("--heartbeat--");
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
          <>
            {(subtitles()?.length !== 0 && attachedInfo()?.length !== 0) &&
              <div
                id={`${elem.id}-wrapper`}
                style={{
                  "z-index": (attachedInfo() as AttachedInfo[])[idx()].zIndex,
                  "position": `${(attachedInfo() as AttachedInfo[])[idx()].position}`,
                  "top": `${(attachedInfo() as AttachedInfo[])[idx()].y}px`,
                }}
                classList={{
                  "mt-2": (attachedInfo() as AttachedInfo[])[idx()].isDrop === false,
                  "mt-2 border-t-2 border-sky-500": (attachedInfo() as AttachedInfo[])[idx()].isDrop === true,
                }}
                hidden={(attachedInfo() as AttachedInfo[])[idx()].hidden}
              >
                <form
                  id={`${elem.id}-form`}
                  onCompositionStart={() => onCompoStartHandler(idx())}
                  onCompositionEnd={() => setIsComposition(false)}
                  onInput={() => onInputHandler(idx())}
                  onKeyDown={(e) => formKeyDownHander(e, idx(), elem)}
                  onSubmit={(e) => onSubmitHandler(e, idx(), elem)}
                  classList={{
                    "flex px-2 gap-2 items-center": (attachedInfo() as AttachedInfo[])[idx()].changeStatus === 0,
                    "flex px-2 gap-2 items-center border-2 border-sky-500 rounded-lg": (attachedInfo() as AttachedInfo[])[idx()].changeStatus === 1,
                    "flex px-2 gap-2 items-center border-2 border-red-500 rounded-lg": (attachedInfo() as AttachedInfo[])[idx()].changeStatus === 2,
                  }}
                >
                  <Switch fallback={
                    <div
                      onMouseDown={(e) => startDragHandler(e, idx(), elem)}
                      classList={{
                        "cursor-move flex gap-3 w-[180px] items-center px-1 rounded-md bg-orange-500/70 select-none": canOrder() === true,
                        "flex gap-3 w-[180px] items-center px-1 rounded-md bg-orange-500/70 select-none": canOrder() === false,
                      }}
                    >
                      <div class="flex-1">
                        {elem.input_time}
                      </div>
                      <div class="flex-1 truncate text-center">
                        {elem.translated_by}
                      </div>
                    </div>
                  }>
                    <Match when={(attachedInfo() as AttachedInfo[])[idx()].isEditing}>
                      <div
                          onMouseDown={(e) => startDragHandler(e, idx(), elem)}
                          classList={{
                            "cursor-move flex gap-3 w-[180px] items-center px-1 rounded-md bg-red-500/70 select-none": canOrder() === true,
                            "flex gap-3 w-[180px] items-center px-1 rounded-md bg-red-500/70 select-none": canOrder() === false,
                          }}
                        >
                        <div class="flex gap-1 justify-center items-center flex-1 truncate">
                          <div class="flex-1">
                            <div class="shrink-0 animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                          </div>
                          <div class="flex-1">{(attachedInfo() as AttachedInfo[])[idx()].editingUser}</div>
                        </div>
                      </div>
                    </Match>
                    <Match when={elem.checked_by !== null && elem.checked_by !== ""}>
                      <div
                        onMouseDown={(e) => startDragHandler(e, idx(), elem)}
                        classList={{
                          "cursor-move flex gap-3 w-[180px] items-center px-1 rounded-md bg-green-500/70 select-none": canOrder() === true,
                          "flex gap-3 w-[180px] items-center px-1 rounded-md bg-green-500/70 select-none": canOrder() === false,
                        }}
                      >
                        <div class="flex-1">
                          {elem.input_time}
                        </div>
                        <div class="flex-1 truncate text-center">
                          {elem.checked_by}
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
                    onfocus={() => wsSend.editStart(props.ws, elem.id)}
                    onBlur={() => wsSend.editEnd(props.ws, elem.id)}
                    value={elem.subtitle}
                    class={inputStyle}
                  />
                  <input
                    id={idx() + "-ori"}
                    type="text"
                    name="origin"
                    autocomplete="off"
                    placeholder="请输入原文"
                    onfocus={() => wsSend.editStart(props.ws, elem.id)}
                    onBlur={() => wsSend.editEnd(props.ws, elem.id)}
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
            }
          </>
        )}}</For>
    </div>
  )
}

export default CheckArea
