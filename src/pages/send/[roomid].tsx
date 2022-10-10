// dependencies lib
import { Title } from "@solidjs/meta";
import { createEffect, onCleanup, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

// local dependencies
import { FloatingWindow } from "@/components";
import { Navi, SendArea, SendPane } from "@/components/pages";
import _currentInfo from "@/components/contexts/current-info-ctx";
import _subtitles from "@/components/contexts/subtitles"
import { wsOn } from "@/controllers"


const SendPage = () => {
  const { currentUser, userList, setUserList } = _currentInfo
  const { setFloatingElem, setSubtitles } = _subtitles
  const [ _ws, setWs ] = createSignal<WebSocket>()

  // 每个page连接不一样的ws room
  const baseUrl = "ws://192.168.64.3:8080/ws/"
  const param = useParams<{ roomid: string }>()
  const url = baseUrl + param.roomid

  createEffect(() => {
    if (currentUser().id === -1) {
      return
    }
    console.log("now data fetched", currentUser());
    setWs(new WebSocket(url))
    const ws = _ws()
    if (!ws) {
      console.log("send page ws is undefined");
      return
    }
    ws.onopen = () => {
      wsOn.onopen(ws, param.roomid)
    }
    ws.onclose = () => {
      console.log("ws close");
    }
    ws.onerror = (evt) => {
      console.log("ws err", evt);
    }
    onCleanup(() => {
      if (ws.readyState === ws.OPEN) {
        ws.close()
      }
      setFloatingElem(undefined)
      setSubtitles(undefined)
      setUserList(undefined)
    })
  })

  return (
    <>
      <Title>发送页面</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg mb-2 text-xl py-3 px-5">
          <Navi
            currentProject={param.roomid}
            userList={userList()}
          ></Navi>
        </div>
        <div class="flex flex-auto pl-2">
          <div class="flex flex-col">
          <FloatingWindow
              defaultWindowSize={{
                width: 500,
                height: 200,
              }}
              minWindowSize={{
                width: 435,
                height: 80,
              }}
              wrapperClass="w-[500px] h-[200px] mb-1 flex flex-col"
              controllerWrapperClass="flex justify-between items-center border-x-2 border-t-2 border-gray-500 rounded-t-lg bg-neutral-800"
              floatingControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              }
              floatingContent={
                <div class="select-none">字幕预览区</div>
              }
              cancelControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              contentsWrapperClass="border-2 border-gray-500 rounded-b-lg flex-auto bg-neutral-700"
              risizerClass="bg-neutral-800 border-l-2 border-t-2 border-gray-500"
            >
              <div>字幕预览</div>
            </FloatingWindow>
            <FloatingWindow
              defaultWindowSize={{
                width: 500,
                height: "",
              }}
              minWindowSize={{
                width: 435,
                height: 80,
              }}
              wrapperClass="w-[500px] flex flex-col"
              controllerWrapperClass="flex justify-between items-center border-x-2 border-t-2 border-gray-500 rounded-t-lg bg-neutral-800"
              floatingControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              }
              floatingContent={
                <div class="select-none">发送工具</div>
              }
              cancelControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              contentsWrapperClass="border-2 border-gray-500 rounded-b-lg flex-auto bg-neutral-700"
              risizerClass="bg-neutral-800 border-l-2 border-t-2 border-gray-500"
            >
              <SendPane
                current_room={param.roomid}
                ws={_ws()}
              ></SendPane>
            </FloatingWindow>
          </div>
          <div class="flex-auto h-[calc(100vh-70px)]" >
            <SendArea ws={_ws()}></SendArea>
          </div>
        </div>
      </div>
    </>
  )
}

export default SendPage
